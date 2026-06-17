import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client

from api.v1 import bills, health
from core.config import settings
from services.bill_sync import BillSyncService
from services.division_sync import DivisionSyncService
from services.parliament_client import ParliamentClient
from services.scheduler import create_scheduler

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    logger.info("Starting up (environment=%s)", settings.environment)

    http_client = httpx.AsyncClient(timeout=30.0)
    parliament = ParliamentClient(http_client)
    supabase = create_client(settings.supabase_url, settings.supabase_service_role_key)

    bill_sync = BillSyncService(supabase, parliament)
    division_sync = DivisionSyncService(supabase, parliament)

    app.state.supabase = supabase
    app.state.parliament = parliament
    app.state.bill_sync = bill_sync
    app.state.division_sync = division_sync

    scheduler = create_scheduler(bill_sync, division_sync)
    scheduler.start()
    logger.info("Scheduler started")

    yield

    scheduler.shutdown(wait=False)
    await http_client.aclose()
    logger.info("Shutting down")


app = FastAPI(title="The Public Ledger API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/v1")
app.include_router(bills.router, prefix="/api/v1")
