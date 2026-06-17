"""
Schema Service — Elasticsearch Index Templates for 9 Forensic Artifact Categories.

Defines mappings for each artifact type and auto-creates indices on startup.
"""

import logging
from app.config import settings
from app.services.elasticsearch_service import es_service

logger = logging.getLogger("dfir.schema")

# ── Index prefix ──
PREFIX = settings.elasticsearch_index_prefix


# ── 9 Artifact Index Definitions ──
INDEX_SCHEMAS: dict[str, dict] = {
    f"{PREFIX}-system-logs": {
        "properties": {
            "timestamp": {"type": "date"},
            "event_id": {"type": "integer"},
            "source": {"type": "keyword"},
            "level": {"type": "keyword"},
            "channel": {"type": "keyword"},
            "computer": {"type": "keyword"},
            "message": {"type": "text", "analyzer": "standard"},
            "user_sid": {"type": "keyword"},
            "process_id": {"type": "integer"},
            "raw_xml": {"type": "text", "index": False},
        }
    },
    f"{PREFIX}-browser-history": {
        "properties": {
            "url": {"type": "text", "fields": {"keyword": {"type": "keyword"}}},
            "title": {"type": "text"},
            "visit_time": {"type": "date"},
            "visit_count": {"type": "integer"},
            "browser": {"type": "keyword"},
            "profile": {"type": "keyword"},
            "transition_type": {"type": "keyword"},
            "duration_ms": {"type": "long"},
        }
    },
    f"{PREFIX}-registry-hives": {
        "properties": {
            "key_path": {"type": "text", "fields": {"keyword": {"type": "keyword"}}},
            "value_name": {"type": "keyword"},
            "value_data": {"type": "text"},
            "value_type": {"type": "keyword"},
            "last_written": {"type": "date"},
            "hive": {"type": "keyword"},
            "suspicious": {"type": "boolean"},
        }
    },
    f"{PREFIX}-memory-dumps": {
        "properties": {
            "pid": {"type": "integer"},
            "process_name": {"type": "keyword"},
            "ppid": {"type": "integer"},
            "cmdline": {"type": "text"},
            "create_time": {"type": "date"},
            "num_threads": {"type": "integer"},
            "connections": {
                "type": "nested",
                "properties": {
                    "local_addr": {"type": "ip"},
                    "local_port": {"type": "integer"},
                    "remote_addr": {"type": "ip"},
                    "remote_port": {"type": "integer"},
                    "state": {"type": "keyword"},
                },
            },
            "dlls": {"type": "keyword"},
            "malfind_hits": {"type": "integer"},
            "suspicious": {"type": "boolean"},
        }
    },
    f"{PREFIX}-network-pcap": {
        "properties": {
            "timestamp": {"type": "date"},
            "src_ip": {"type": "ip"},
            "dst_ip": {"type": "ip"},
            "src_port": {"type": "integer"},
            "dst_port": {"type": "integer"},
            "protocol": {"type": "keyword"},
            "length": {"type": "integer"},
            "payload_entropy": {"type": "float"},
            "flags": {"type": "keyword"},
            "info": {"type": "text"},
        }
    },
    f"{PREFIX}-file-metadata": {
        "properties": {
            "path": {"type": "text", "fields": {"keyword": {"type": "keyword"}}},
            "filename": {"type": "keyword"},
            "extension": {"type": "keyword"},
            "hash_md5": {"type": "keyword"},
            "hash_sha256": {"type": "keyword"},
            "size_bytes": {"type": "long"},
            "modified": {"type": "date"},
            "accessed": {"type": "date"},
            "created": {"type": "date"},
            "born": {"type": "date"},
            "entropy": {"type": "float"},
            "suspicious": {"type": "boolean"},
        }
    },
    f"{PREFIX}-process-traces": {
        "properties": {
            "executable": {"type": "keyword"},
            "path": {"type": "text", "fields": {"keyword": {"type": "keyword"}}},
            "run_count": {"type": "integer"},
            "last_run": {"type": "date"},
            "source_artifact": {"type": "keyword"},
            "hash_sha256": {"type": "keyword"},
            "suspicious": {"type": "boolean"},
        }
    },
    f"{PREFIX}-shell-logs": {
        "properties": {
            "timestamp": {"type": "date"},
            "command": {"type": "text", "fields": {"keyword": {"type": "keyword"}}},
            "user": {"type": "keyword"},
            "shell_type": {"type": "keyword"},
            "is_base64_encoded": {"type": "boolean"},
            "is_download_cradle": {"type": "boolean"},
            "decoded_content": {"type": "text"},
            "suspicious": {"type": "boolean"},
        }
    },
    f"{PREFIX}-usb-devices": {
        "properties": {
            "serial_number": {"type": "keyword"},
            "vendor": {"type": "keyword"},
            "product": {"type": "keyword"},
            "vendor_id": {"type": "keyword"},
            "product_id": {"type": "keyword"},
            "first_connected": {"type": "date"},
            "last_connected": {"type": "date"},
            "drive_letter": {"type": "keyword"},
            "volume_name": {"type": "keyword"},
        }
    },
}


class SchemaService:
    """Manages Elasticsearch index creation and schema validation."""

    async def ensure_all_indices(self):
        """Create all 9 artifact indices if they don't exist."""
        for index_name, mapping in INDEX_SCHEMAS.items():
            success = await es_service.create_index(index_name, mapping)
            if success:
                logger.info(f"✅ Index ready: {index_name}")
            else:
                logger.warning(f"⚠️  Failed to ensure index: {index_name}")

    def get_index_name(self, category: str) -> str:
        """Get the full index name for an artifact category."""
        return f"{PREFIX}-{category}"

    def list_categories(self) -> list[str]:
        """List all artifact category slugs."""
        return [name.replace(f"{PREFIX}-", "") for name in INDEX_SCHEMAS.keys()]

    def get_schema(self, category: str) -> dict | None:
        """Get the mapping schema for a specific category."""
        index_name = self.get_index_name(category)
        return INDEX_SCHEMAS.get(index_name)


# Singleton
schema_service = SchemaService()
