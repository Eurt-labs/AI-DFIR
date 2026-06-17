"""
Artifacts Router — Search and browse forensic artifacts across all indices.
"""

from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from app.config import settings
from app.services.elasticsearch_service import es_service
from app.services.schema_service import schema_service

router = APIRouter()


@router.get("/search")
async def search_artifacts(
    q: str = Query(..., description="Search query string"),
    category: Optional[str] = Query(None, description="Filter by artifact category"),
    size: int = Query(50, ge=1, le=500, description="Number of results"),
):
    """
    Full-text search across all artifact indices.

    Searches the message, command, url, path, and process_name fields.
    Optionally filter by artifact category.
    """
    if not es_service.is_connected:
        raise HTTPException(status_code=503, detail="Elasticsearch is not available")

    # Determine which indices to search
    if category:
        index_pattern = schema_service.get_index_name(category)
    else:
        index_pattern = f"{settings.elasticsearch_index_prefix}-*"

    # Build multi_match query across common text fields
    query = {
        "multi_match": {
            "query": q,
            "fields": [
                "message",
                "command",
                "url",
                "path",
                "process_name",
                "filename",
                "key_path",
                "indicator",
                "title",
            ],
            "type": "best_fields",
            "fuzziness": "AUTO",
        }
    }

    result = await es_service.search(
        index_pattern=index_pattern,
        query=query,
        size=size,
        sort=[{"_score": "desc"}],
    )

    return {
        "query": q,
        "category": category or "all",
        "total": result["total"],
        "hits": result["hits"],
    }


@router.get("/categories")
async def list_categories():
    """List all available artifact categories."""
    categories = schema_service.list_categories()

    # Get stats if ES is connected
    stats = []
    if es_service.is_connected:
        raw_stats = await es_service.get_index_stats()
        stats_map = {s["index"]: s for s in raw_stats}

        for cat in categories:
            index_name = schema_service.get_index_name(cat)
            idx_stats = stats_map.get(index_name, {})
            stats.append({
                "category": cat,
                "index": index_name,
                "docs_count": idx_stats.get("docs_count", 0),
                "size_human": idx_stats.get("size_human", "0 B"),
            })
    else:
        stats = [{"category": cat, "index": schema_service.get_index_name(cat), "docs_count": 0, "size_human": "0 B"} for cat in categories]

    return {"categories": stats}


@router.get("/{category}")
async def list_artifacts(
    category: str,
    size: int = Query(50, ge=1, le=500),
    sort_by: str = Query("timestamp", description="Field to sort by"),
    order: str = Query("desc", description="Sort order: asc or desc"),
):
    """List artifacts in a specific category."""
    # Validate category
    valid_categories = schema_service.list_categories()
    if category not in valid_categories:
        raise HTTPException(
            status_code=404,
            detail=f"Category '{category}' not found. Valid: {valid_categories}",
        )

    if not es_service.is_connected:
        raise HTTPException(status_code=503, detail="Elasticsearch is not available")

    index_name = schema_service.get_index_name(category)

    result = await es_service.search(
        index_pattern=index_name,
        query={"match_all": {}},
        size=size,
        sort=[{sort_by: {"order": order, "unmapped_type": "date"}}],
    )

    return {
        "category": category,
        "index": index_name,
        "total": result["total"],
        "hits": result["hits"],
    }


@router.get("/{category}/{doc_id}")
async def get_artifact(category: str, doc_id: str):
    """Get a single artifact by ID."""
    valid_categories = schema_service.list_categories()
    if category not in valid_categories:
        raise HTTPException(status_code=404, detail=f"Category '{category}' not found")

    if not es_service.is_connected:
        raise HTTPException(status_code=503, detail="Elasticsearch is not available")

    index_name = schema_service.get_index_name(category)

    result = await es_service.search(
        index_pattern=index_name,
        query={"ids": {"values": [doc_id]}},
        size=1,
    )

    if not result["hits"]:
        raise HTTPException(status_code=404, detail=f"Artifact {doc_id} not found")

    return result["hits"][0]
