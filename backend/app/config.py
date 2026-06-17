"""
AI-DFIR Backend Configuration

Loads settings from environment variables or .env file.
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment."""

    # Elasticsearch
    elasticsearch_url: str = "http://localhost:9200"
    elasticsearch_index_prefix: str = "dfir"
    elasticsearch_username: Optional[str] = None
    elasticsearch_password: Optional[str] = None

    # Kibana
    kibana_url: str = "http://localhost:5601"

    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_cors_origins: str = "http://localhost:3000,http://localhost:3001"

    # Storage
    upload_dir: str = "./uploads"
    max_upload_size_mb: int = 5120  # 5 GB

    # Application
    app_name: str = "AI-DFIR Platform"
    app_version: str = "0.2.0"
    debug: bool = True

    model_config = {
        "env_file": "../.env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
    }


settings = Settings()
