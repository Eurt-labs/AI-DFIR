/**
 * AI-DFIR Frontend API Client
 *
 * Centralized fetch wrappers for communicating with the FastAPI backend.
 * All functions return typed data and gracefully handle offline/error states
 * by returning fallback values instead of throwing.
 */

const API_BASE = "/api";

// ── Types ──

export interface HealthResponse {
  status: string;
  app: string;
  version: string;
  elasticsearch: {
    status: string;
    cluster_name?: string;
    number_of_nodes?: number;
    active_shards?: number;
  };
  services: {
    api: string;
    elasticsearch: string;
  };
}

export interface IndexStatus {
  category: string;
  index: string;
  docs_count: number;
  size_human: string;
  status: string;
}

export interface PipelineStatus {
  pipeline_healthy: boolean;
  elasticsearch_connected: boolean;
  total_indices: number;
  total_documents: number;
  indices: IndexStatus[];
}

export interface IngestResult {
  filename: string;
  category: string;
  documents_parsed: number;
  documents_indexed: number;
  errors: number;
  duration_ms: number;
  status: string;
  message: string | null;
}

export interface CategoryStat {
  category: string;
  index: string;
  docs_count: number;
  size_human: string;
}

export interface SearchHit {
  _id: string;
  _index: string;
  [key: string]: unknown;
}

export interface SearchResponse {
  query: string;
  category: string;
  total: number;
  hits: SearchHit[];
}

export interface ArtifactListResponse {
  category: string;
  index: string;
  total: number;
  hits: SearchHit[];
}

// ── Helpers ──

async function fetchJSON<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      console.warn(`API ${url} returned ${res.status}`);
      return fallback;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`API ${url} unreachable:`, err);
    return fallback;
  }
}

// ── Health ──

const HEALTH_FALLBACK: HealthResponse = {
  status: "offline",
  app: "AI-DFIR Platform",
  version: "0.2.0",
  elasticsearch: { status: "disconnected" },
  services: { api: "offline", elasticsearch: "disconnected" },
};

export async function getHealth(): Promise<HealthResponse> {
  return fetchJSON("/health", HEALTH_FALLBACK);
}

// ── Pipeline ──

const PIPELINE_FALLBACK: PipelineStatus = {
  pipeline_healthy: false,
  elasticsearch_connected: false,
  total_indices: 0,
  total_documents: 0,
  indices: [],
};

export async function getPipelineStatus(): Promise<PipelineStatus> {
  return fetchJSON("/pipeline/status", PIPELINE_FALLBACK);
}

export async function uploadFile(file: File): Promise<IngestResult> {
  const form = new FormData();
  form.append("file", file);

  try {
    const res = await fetch(`${API_BASE}/pipeline/ingest`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      return {
        filename: file.name,
        category: "unknown",
        documents_parsed: 0,
        documents_indexed: 0,
        errors: 1,
        duration_ms: 0,
        status: "error",
        message: err.detail || `Upload failed (${res.status})`,
      };
    }

    return (await res.json()) as IngestResult;
  } catch (err) {
    return {
      filename: file.name,
      category: "unknown",
      documents_parsed: 0,
      documents_indexed: 0,
      errors: 1,
      duration_ms: 0,
      status: "error",
      message: "Backend is unreachable",
    };
  }
}

// ── Artifacts ──

export async function getCategories(): Promise<CategoryStat[]> {
  const data = await fetchJSON<{ categories: CategoryStat[] }>(
    "/artifacts/categories",
    { categories: [] }
  );
  return data.categories;
}

export async function searchArtifacts(
  query: string,
  category?: string,
  size = 20
): Promise<SearchResponse> {
  const params = new URLSearchParams({ q: query, size: String(size) });
  if (category) params.set("category", category);

  return fetchJSON(`/artifacts/search?${params}`, {
    query,
    category: category || "all",
    total: 0,
    hits: [],
  });
}

export async function listArtifacts(
  category: string,
  size = 50,
  sortBy = "timestamp",
  order = "desc"
): Promise<ArtifactListResponse> {
  const params = new URLSearchParams({
    size: String(size),
    sort_by: sortBy,
    order,
  });

  return fetchJSON(`/artifacts/${category}?${params}`, {
    category,
    index: "",
    total: 0,
    hits: [],
  });
}
