"""
Ingest Service — Orchestrates file parsing and Elasticsearch ingestion.

Detects file types, routes to the appropriate parser, and bulk-indexes
parsed documents into the correct Elasticsearch index.
"""

import time
import logging
from pathlib import Path
from typing import Optional

from app.config import settings
from app.services.elasticsearch_service import es_service
from app.services.schema_service import schema_service
from app.parsers.evtx_parser import parse_evtx_file
from app.parsers.syslog_parser import parse_syslog_file
from app.parsers.sqlite_parser import parse_browser_sqlite

logger = logging.getLogger("dfir.ingest")

# File extension to category + parser mapping
FILE_TYPE_MAP = {
    ".evtx": ("system-logs", parse_evtx_file),
    ".log": ("system-logs", parse_syslog_file),
    ".syslog": ("system-logs", parse_syslog_file),
    ".sqlite": ("browser-history", parse_browser_sqlite),
    ".db": ("browser-history", parse_browser_sqlite),
}

# Batch size for bulk Elasticsearch ingestion
BATCH_SIZE = 500


class IngestService:
    """Orchestrates file parsing and Elasticsearch bulk indexing."""

    def detect_file_type(self, filename: str) -> Optional[tuple[str, callable]]:
        """
        Detect the artifact category and parser based on file extension.

        Returns:
            Tuple of (category_slug, parser_function) or None
        """
        ext = Path(filename).suffix.lower()
        return FILE_TYPE_MAP.get(ext)

    async def ingest_file(self, file_path: str, filename: str) -> dict:
        """
        Parse and ingest a forensic file into Elasticsearch.

        Args:
            file_path: Local path to the uploaded file
            filename: Original filename (for type detection)

        Returns:
            Ingestion result dictionary
        """
        start_time = time.time()

        # Detect file type
        detection = self.detect_file_type(filename)
        if detection is None:
            return {
                "filename": filename,
                "category": "unknown",
                "documents_parsed": 0,
                "documents_indexed": 0,
                "errors": 0,
                "duration_ms": 0,
                "status": "error",
                "message": f"Unsupported file type: {Path(filename).suffix}",
            }

        category, parser_fn = detection
        index_name = schema_service.get_index_name(category)

        logger.info(f"Ingesting {filename} → {index_name}")

        # Parse the file
        documents = list(parser_fn(file_path))
        total_parsed = len(documents)

        if total_parsed == 0:
            return {
                "filename": filename,
                "category": category,
                "documents_parsed": 0,
                "documents_indexed": 0,
                "errors": 0,
                "duration_ms": int((time.time() - start_time) * 1000),
                "status": "warning",
                "message": "No documents extracted from file",
            }

        # Bulk index in batches
        total_indexed = 0
        total_errors = 0

        for i in range(0, total_parsed, BATCH_SIZE):
            batch = documents[i : i + BATCH_SIZE]
            result = await es_service.bulk_ingest(index_name, batch)
            total_indexed += result.get("indexed", 0)
            total_errors += result.get("errors", 0)

        duration_ms = int((time.time() - start_time) * 1000)

        logger.info(
            f"Ingestion complete: {filename} → "
            f"{total_indexed}/{total_parsed} docs in {duration_ms}ms"
        )

        return {
            "filename": filename,
            "category": category,
            "documents_parsed": total_parsed,
            "documents_indexed": total_indexed,
            "errors": total_errors,
            "duration_ms": duration_ms,
            "status": "success" if total_errors == 0 else "partial",
            "message": f"Indexed {total_indexed} of {total_parsed} documents",
        }


# Singleton
ingest_service = IngestService()
