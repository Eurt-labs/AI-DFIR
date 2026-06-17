"""
Pipeline Router — Ingestion pipeline status, control, and file upload.
"""

import os
import logging
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.config import settings
from app.services.elasticsearch_service import es_service
from app.services.schema_service import schema_service
from app.services.ingest_service import ingest_service

logger = logging.getLogger("dfir.router.pipeline")

router = APIRouter()


@router.get("/status")
async def pipeline_status():
    """Get overall pipeline status and per-index stats."""
    es_connected = es_service.is_connected
    stats = await es_service.get_index_stats() if es_connected else []
    categories = schema_service.list_categories()

    # Map stats by index name
    stats_map = {s["index"]: s for s in stats}

    index_statuses = []
    for cat in categories:
        index_name = schema_service.get_index_name(cat)
        idx_stats = stats_map.get(index_name, {})
        index_statuses.append({
            "category": cat,
            "index": index_name,
            "docs_count": idx_stats.get("docs_count", 0),
            "size_human": idx_stats.get("size_human", "0 B"),
            "status": "active" if idx_stats.get("docs_count", 0) > 0 else "empty",
        })

    total_docs = sum(s.get("docs_count", 0) for s in stats)

    return {
        "pipeline_healthy": es_connected,
        "elasticsearch_connected": es_connected,
        "total_indices": len(categories),
        "total_documents": total_docs,
        "indices": index_statuses,
    }


@router.get("/stats")
async def pipeline_stats():
    """Get raw Elasticsearch index stats."""
    if not es_service.is_connected:
        raise HTTPException(
            status_code=503,
            detail="Elasticsearch is not available",
        )

    stats = await es_service.get_index_stats()
    return {"indices": stats}


@router.post("/ingest")
async def ingest_file(file: UploadFile = File(...)):
    """
    Upload and ingest a forensic evidence file.

    Supported formats: .evtx, .log, .syslog, .sqlite, .db
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    # Validate file type
    detection = ingest_service.detect_file_type(file.filename)
    if detection is None:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {Path(file.filename).suffix}. "
            f"Supported: .evtx, .log, .syslog, .sqlite, .db",
        )

    # Save uploaded file
    os.makedirs(settings.upload_dir, exist_ok=True)
    file_path = os.path.join(settings.upload_dir, file.filename)

    try:
        content = await file.read()

        # Check file size
        if len(content) > settings.max_upload_size_mb * 1024 * 1024:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum: {settings.max_upload_size_mb} MB",
            )

        with open(file_path, "wb") as f:
            f.write(content)

        logger.info(f"Saved upload: {file.filename} ({len(content)} bytes)")

        # Parse and ingest
        if not es_service.is_connected:
            raise HTTPException(
                status_code=503,
                detail="Elasticsearch is not available — cannot ingest",
            )

        result = await ingest_service.ingest_file(file_path, file.filename)
        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Ingestion failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)
