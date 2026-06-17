"""Pipeline status Pydantic models."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class PipelineStatus(BaseModel):
    """Overall pipeline health."""

    elasticsearch_status: str
    elasticsearch_version: Optional[str] = None
    total_indices: int = 0
    total_documents: int = 0
    pipeline_healthy: bool = False


class IndexStatus(BaseModel):
    """Status of a single Elasticsearch index."""

    index: str
    category: str
    docs_count: int = 0
    size_human: str = "0 B"
    status: str = "unknown"


class IngestResult(BaseModel):
    """Result of a file ingestion operation."""

    filename: str
    category: str
    documents_parsed: int = 0
    documents_indexed: int = 0
    errors: int = 0
    duration_ms: int = 0
    status: str = "success"
    message: Optional[str] = None
