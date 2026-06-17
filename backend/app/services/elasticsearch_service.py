"""
Elasticsearch Service — Async client wrapper for the AI-DFIR backend.

Provides connection management, health checks, bulk ingestion,
and search capabilities against the Elasticsearch cluster.
"""

import logging
from typing import Any, Optional

from elasticsearch import AsyncElasticsearch, NotFoundError, ConnectionError as ESConnectionError

from app.config import settings

logger = logging.getLogger("dfir.elasticsearch")


class ElasticsearchService:
    """Async Elasticsearch client wrapper."""

    def __init__(self):
        self.client: Optional[AsyncElasticsearch] = None
        self._connected = False

    async def connect(self) -> bool:
        """Initialize connection to Elasticsearch."""
        try:
            kwargs: dict[str, Any] = {
                "hosts": [settings.elasticsearch_url],
                "request_timeout": 30,
                "max_retries": 3,
                "retry_on_timeout": True,
            }

            # Add auth if configured
            if settings.elasticsearch_username and settings.elasticsearch_password:
                kwargs["basic_auth"] = (
                    settings.elasticsearch_username,
                    settings.elasticsearch_password,
                )

            self.client = AsyncElasticsearch(**kwargs)

            # Verify connectivity
            info = await self.client.info()
            logger.info(
                f"Connected to Elasticsearch {info['version']['number']} "
                f"(cluster: {info['cluster_name']})"
            )
            self._connected = True
            return True

        except Exception as e:
            logger.error(f"Failed to connect to Elasticsearch: {e}")
            self._connected = False
            return False

    async def close(self):
        """Close the Elasticsearch connection."""
        if self.client:
            await self.client.close()
            self._connected = False
            logger.info("Elasticsearch connection closed")

    @property
    def is_connected(self) -> bool:
        return self._connected

    async def health(self) -> dict:
        """Get cluster health status."""
        if not self.client or not self._connected:
            return {"status": "disconnected"}
        try:
            health = await self.client.cluster.health()
            return {
                "status": health["status"],
                "cluster_name": health["cluster_name"],
                "number_of_nodes": health["number_of_nodes"],
                "active_shards": health["active_shards"],
            }
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return {"status": "error", "error": str(e)}

    async def create_index(self, index_name: str, mappings: dict) -> bool:
        """Create an index with mappings if it doesn't exist."""
        if not self.client:
            return False
        try:
            exists = await self.client.indices.exists(index=index_name)
            if not exists:
                await self.client.indices.create(
                    index=index_name,
                    body={"mappings": mappings},
                )
                logger.info(f"Created index: {index_name}")
            else:
                logger.debug(f"Index already exists: {index_name}")
            return True
        except Exception as e:
            logger.error(f"Failed to create index {index_name}: {e}")
            return False

    async def bulk_ingest(self, index_name: str, documents: list[dict]) -> dict:
        """Bulk ingest documents into an index."""
        if not self.client or not documents:
            return {"indexed": 0, "errors": 0}

        operations = []
        for doc in documents:
            operations.append({"index": {"_index": index_name}})
            operations.append(doc)

        try:
            result = await self.client.bulk(operations=operations, refresh="wait_for")
            errors = sum(1 for item in result["items"] if item["index"].get("error"))
            return {
                "indexed": len(documents) - errors,
                "errors": errors,
                "took_ms": result.get("took", 0),
            }
        except Exception as e:
            logger.error(f"Bulk ingest failed: {e}")
            return {"indexed": 0, "errors": len(documents), "error": str(e)}

    async def search(
        self,
        index_pattern: str,
        query: dict,
        size: int = 50,
        sort: Optional[list] = None,
    ) -> dict:
        """Search across one or more indices."""
        if not self.client:
            return {"hits": [], "total": 0}

        try:
            body: dict[str, Any] = {"query": query, "size": size}
            if sort:
                body["sort"] = sort

            result = await self.client.search(index=index_pattern, body=body)
            hits = [
                {
                    "_id": hit["_id"],
                    "_index": hit["_index"],
                    **hit["_source"],
                }
                for hit in result["hits"]["hits"]
            ]
            total = result["hits"]["total"]["value"]
            return {"hits": hits, "total": total}
        except NotFoundError:
            return {"hits": [], "total": 0}
        except Exception as e:
            logger.error(f"Search failed: {e}")
            return {"hits": [], "total": 0, "error": str(e)}

    async def get_index_stats(self) -> list[dict]:
        """Get stats for all DFIR indices."""
        if not self.client:
            return []

        prefix = settings.elasticsearch_index_prefix
        try:
            stats = await self.client.indices.stats(index=f"{prefix}-*")
            indices_stats = []
            for name, data in stats.get("indices", {}).items():
                primaries = data.get("primaries", {})
                indices_stats.append({
                    "index": name,
                    "docs_count": primaries.get("docs", {}).get("count", 0),
                    "size_bytes": primaries.get("store", {}).get("size_in_bytes", 0),
                    "size_human": self._format_bytes(
                        primaries.get("store", {}).get("size_in_bytes", 0)
                    ),
                })
            return indices_stats
        except Exception as e:
            logger.error(f"Failed to get index stats: {e}")
            return []

    @staticmethod
    def _format_bytes(size_bytes: int) -> str:
        """Format bytes into human-readable string."""
        for unit in ["B", "KB", "MB", "GB"]:
            if size_bytes < 1024.0:
                return f"{size_bytes:.1f} {unit}"
            size_bytes /= 1024.0
        return f"{size_bytes:.1f} TB"


# Singleton instance
es_service = ElasticsearchService()
