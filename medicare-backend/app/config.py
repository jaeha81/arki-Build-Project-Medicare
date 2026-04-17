from pydantic_settings import BaseSettings, SettingsConfigDict
import secrets
import logging

logger = logging.getLogger(__name__)

_WEAK_SECRETS = {
    "dev-secret-change-in-production",
    "dev-admin-token-placeholder",
    "change-me",
    "secret",
}

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
    admin_api_token: str = "dev-admin-token-placeholder"
    allowed_origins: list[str] = ["http://localhost:3000"]
    debug: bool = True
    agents_service_url: str = "http://localhost:8001"

    def model_post_init(self, __context: object) -> None:
        if not self.debug:
            # 프로덕션에서 약한 시크릿 사용 시 강제 종료
            if self.jwt_secret in _WEAK_SECRETS or len(self.jwt_secret) < 32:
                raise ValueError(
                    "JWT_SECRET must be set to a strong secret (≥32 chars) in production. "
                    "Run: python -c \"import secrets; print(secrets.token_hex(32))\""
                )
            if self.admin_api_token in _WEAK_SECRETS or len(self.admin_api_token) < 32:
                raise ValueError(
                    "ADMIN_API_TOKEN must be set to a strong secret (≥32 chars) in production."
                )
        else:
            if self.jwt_secret in _WEAK_SECRETS:
                logger.warning(
                    "[DEV] jwt_secret is using the default placeholder. "
                    "Set JWT_SECRET in .env before deploying."
                )
            if self.admin_api_token in _WEAK_SECRETS:
                logger.warning(
                    "[DEV] admin_api_token is using the default placeholder. "
                    "Set ADMIN_API_TOKEN in .env before deploying."
                )

settings = Settings()
