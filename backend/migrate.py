"""
Migration runner. Reads SUPABASE_DB_URL from environment (deployment secret, not .env).
Run before starting the server: python -m backend.migrate
On Fly.io wire this up as a release_command in fly.toml.
"""
import logging
import os
import sys
from pathlib import Path

import psycopg2

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MIGRATIONS_DIR = Path(__file__).parent / "migrations"


def run_migrations(db_url: str) -> None:
    conn = psycopg2.connect(db_url)
    try:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS _migrations (
                    name TEXT PRIMARY KEY,
                    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
                )
            """)
            conn.commit()

            for path in sorted(MIGRATIONS_DIR.glob("*.sql")):
                name = path.name
                cur.execute("SELECT name FROM _migrations WHERE name = %s", (name,))
                if cur.fetchone():
                    logger.info("Skipping %s (already applied)", name)
                    continue
                logger.info("Applying %s", name)
                cur.execute(path.read_text())
                cur.execute("INSERT INTO _migrations (name) VALUES (%s)", (name,))
                conn.commit()
                logger.info("Applied %s", name)
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    db_url = os.environ.get("SUPABASE_DB_URL")
    if not db_url:
        logger.error("SUPABASE_DB_URL environment variable not set")
        sys.exit(1)
    run_migrations(db_url)
    logger.info("All migrations complete")
