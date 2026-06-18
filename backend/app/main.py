"""
AI-DFIR Backend — FastAPI Application Entry Point

Initializes the FastAPI app, mounts routers, configures CORS,
and manages the Elasticsearch connection lifecycle.
"""

import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.services.elasticsearch_service import es_service
from app.services.schema_service import schema_service
from app.routers import health, pipeline, artifacts

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("dfir")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle hooks."""
    # ── Startup ──
    logger.info("🚀 AI-DFIR Backend starting...")
    logger.info(f"   Elasticsearch: {settings.elasticsearch_url}")

    # Connect to Elasticsearch
    connected = await es_service.connect()
    if connected:
        logger.info("✅ Elasticsearch connected")
        # Create index templates for all 9 artifact categories
        await schema_service.ensure_all_indices()
        logger.info("✅ All 9 forensic indices verified")
    else:
        logger.warning("⚠️  Elasticsearch not available — running in offline mode")

    # Ensure upload directory exists
    os.makedirs(settings.upload_dir, exist_ok=True)

    yield

    # ── Shutdown ──
    logger.info("🛑 Shutting down AI-DFIR Backend...")
    await es_service.close()


# ── Create FastAPI App ──
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-Assisted Digital Forensics & Cyber Threat Investigation API",
    lifespan=lifespan,
)

# ── CORS ──
origins = [o.strip() for o in settings.api_cors_origins.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Mount Routers ──
app.include_router(health.router, prefix="/api/health", tags=["Health"])
app.include_router(pipeline.router, prefix="/api/pipeline", tags=["Pipeline"])
app.include_router(artifacts.router, prefix="/api/artifacts", tags=["Artifacts"])


@app.get("/")
async def root():
    """Root endpoint — API info."""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "online",
        "elasticsearch_connected": es_service.is_connected,
        "docs": "/docs",
    }
