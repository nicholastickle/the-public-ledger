import logging

from pydantic_settings import BaseSettings

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    environment: str = "development"
    cors_origins: list[str] = ["http://localhost:3000"]
    supabase_url: str = ""
    supabase_service_role_key: str = ""

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


settings = Settings()
