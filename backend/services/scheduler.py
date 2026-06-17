import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger

from services.bill_sync import BillSyncService
from services.division_sync import DivisionSyncService

logger = logging.getLogger(__name__)


def create_scheduler(
    bill_sync: BillSyncService,
    division_sync: DivisionSyncService,
) -> AsyncIOScheduler:
    scheduler = AsyncIOScheduler()

    scheduler.add_job(
        _rss_poll,
        IntervalTrigger(minutes=5),
        args=[bill_sync],
        id="rss_poll",
        name="RSS poll (5 min)",
        max_instances=1,
        coalesce=True,
    )

    # Full sweep nightly at 02:00 — catches anything the RSS missed
    scheduler.add_job(
        _full_sync,
        CronTrigger(hour=2, minute=0),
        args=[bill_sync],
        id="nightly_full_sync",
        name="Nightly full sync",
        max_instances=1,
        coalesce=True,
    )

    return scheduler


async def _rss_poll(bill_sync: BillSyncService) -> None:
    try:
        await bill_sync.sync_bills_from_rss()
    except Exception:
        logger.exception("RSS poll job failed")


async def _full_sync(bill_sync: BillSyncService) -> None:
    try:
        await bill_sync.sync_all_active()
    except Exception:
        logger.exception("Nightly full sync job failed")
