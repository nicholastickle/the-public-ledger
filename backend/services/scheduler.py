import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger

from services.bill_sync import BillSyncService
from services.division_sync import DivisionSyncService
from services.regulation_sync import RegulationSyncService

logger = logging.getLogger(__name__)


def create_scheduler(
    bill_sync: BillSyncService,
    division_sync: DivisionSyncService,
    regulation_sync: RegulationSyncService,
) -> AsyncIOScheduler:
    scheduler = AsyncIOScheduler()

    scheduler.add_job(
        _rss_poll,
        IntervalTrigger(minutes=5),
        args=[bill_sync, division_sync],
        id="rss_poll",
        name="RSS poll (5 min) + division sync for updated bills",
        max_instances=1,
        coalesce=True,
    )

    # Full sweep nightly at 02:00 — catches anything the RSS missed, then re-syncs
    # divisions for every active bill so parliamentary results stay current even
    # if a division was recorded after its bill's last RSS-triggered sync.
    scheduler.add_job(
        _full_sync,
        CronTrigger(hour=2, minute=0),
        args=[bill_sync, division_sync],
        id="nightly_full_sync",
        name="Nightly full sync + division sync for all active bills",
        max_instances=1,
        coalesce=True,
    )

    # No RSS-equivalent exists for statutory instruments (see regulation_sync.py),
    # so this re-fetches the recent window on every run rather than an incremental diff.
    scheduler.add_job(
        _regulation_sync,
        IntervalTrigger(minutes=30),
        args=[regulation_sync],
        id="regulation_sync",
        name="Regulation sync (30 min)",
        max_instances=1,
        coalesce=True,
    )

    return scheduler


async def _rss_poll(bill_sync: BillSyncService, division_sync: DivisionSyncService) -> None:
    try:
        bill_ids = await bill_sync.sync_bills_from_rss()
    except Exception:
        logger.exception("RSS poll job failed")
        return

    for bill_id in bill_ids:
        try:
            await division_sync.sync_divisions_for_bill(bill_id)
        except Exception:
            logger.exception("Division sync failed for bill %d after RSS poll", bill_id)


async def _full_sync(bill_sync: BillSyncService, division_sync: DivisionSyncService) -> None:
    try:
        await bill_sync.sync_all_active()
    except Exception:
        logger.exception("Nightly full sync job failed")
        return

    try:
        active_bill_ids = await bill_sync.get_active_bill_ids()
    except Exception:
        logger.exception("Failed to fetch active bill IDs for nightly division sync")
        return

    for bill_id in active_bill_ids:
        try:
            await division_sync.sync_divisions_for_bill(bill_id)
        except Exception:
            logger.exception("Division sync failed for bill %d during nightly sync", bill_id)


async def _regulation_sync(regulation_sync: RegulationSyncService) -> None:
    try:
        await regulation_sync.sync_recent()
        await regulation_sync.sync_details()
    except Exception:
        logger.exception("Regulation sync job failed")
