"""
Health Check Router — System health and connectivity verification.
"""

from fastapi import APIRouter
from app.config import settings
from app.services.elasticsearch_service import es_service

router = APIRouter()


@router.get("/")
async def health_check():
    """Overall system health check."""
    es_health = await es_service.health()

    return {
        "status": "online",
        "app": settings.app_name,
        "version": settings.app_version,
        "elasticsearch": es_health,
        "services": {
            "api": "healthy",
            "elasticsearch": "connected" if es_service.is_connected else "disconnected",
        },
    }


@router.get("/elasticsearch")
async def elasticsearch_health():
    """Detailed Elasticsearch cluster health."""
    if not es_service.is_connected:
        return {
            "status": "disconnected",
            "message": "Elasticsearch is not available",
        }

    health = await es_service.health()
    stats = await es_service.get_index_stats()

    total_docs = sum(s["docs_count"] for s in stats)
    total_size = sum(s["size_bytes"] for s in stats)

    return {
        "cluster": health,
        "indices": stats,
        "totals": {
            "total_indices": len(stats),
            "total_documents": total_docs,
            "total_size": es_service._format_bytes(total_size),
        },
    }
