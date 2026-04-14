from pydantic_settings import BaseSettings, SettingsConfigDict

__all__ = ["Settings", "settings"]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    anthropic_api_key: str = ""
    redis_url: str = "redis://localhost:6379"
    database_url: str = "postgresql+asyncpg://postgres:password@localhost:5432/medicare"
    agent_service_port: int = 8001
    debug: bool = True


settings = Settings()
