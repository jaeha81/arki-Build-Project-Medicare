from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    database_url: str = "postgresql+asyncpg://postgres:password@localhost:5432/medicare"
    redis_url: str = "redis://localhost:6379"
    anthropic_api_key: str = ""
    resend_api_key: str = ""
    jwt_secret: str = "dev-secret-change-in-production"
    admin_api_token: str = "dev-admin-token-placeholder"  # P1 fix: set in .env for prod
    allowed_origins: list[str] = ["http://localhost:3000"]
    debug: bool = True


settings = Settings()
