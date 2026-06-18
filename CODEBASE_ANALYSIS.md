# AI-DFIR Codebase Structure and Architectural Walkthrough

This document provides a comprehensive analysis of the AI-Assisted Digital Forensics and Cyber Threat Investigation (AI-DFIR) codebase. It is designed to help humans, other AI systems, and developers understand the repository's modules, file placements, and detailed line-by-line implementations.

---

## 📂 Directory Layout Overview

```
AI-DFIR/
├── .env                              # Environment variable configuration template
├── docker-compose.yml                # Docker microservices orchestrator (Elasticsearch, Kibana, FastAPI)
├── AI_DFIR_Execution_Plan.md          # Master blueprint roadmap for the 5-layer DFIR framework
├── README.md                         # Core system overview, user roles, tech stack, and ML model details
├── backend/
│   ├── Dockerfile                    # Containerization instructions for FastAPI service
│   ├── requirements.txt              # Backend library dependencies (FastAPI, python-evtx, elasticsearch, etc.)
│   └── app/
│       ├── __init__.py               # Python package initializer
│       ├── config.py                 # Configuration settings loader (Pydantic Settings)
│       ├── main.py                   # FastAPI Application Entry Point & lifecycle hooks
│       ├── parsers/                  # Custom parsing scripts for forensic logs
│       │   ├── __init__.py           # Parser package initializer
│       │   ├── evtx_parser.py        # Windows Event Log (.evtx) XML extractor
│       │   ├── sqlite_parser.py      # Chrome/Edge and Firefox SQLite history parser
│       │   └── syslog_parser.py      # Linux Syslog (RFC 3164/5424) parser
│       ├── routers/                  # API routers (endpoints)
│       │   ├── __init__.py           # Router package initializer
│       │   ├── artifacts.py          # Forensic artifact search and retrieval APIs
│       │   ├── health.py             # System & Elasticsearch cluster checks
│       │   └── pipeline.py           # Ingestion status and file upload triggers
│       ├── schemas/                  # Request & Response verification rules (Pydantic)
│       │   ├── __init__.py           # Schema package initializer
│       │   ├── artifacts.py          # Data definitions for the 9 forensic categories
│       │   └── pipeline.py           # Data definitions for ingestion results & stats
│       └── services/                 # Business logic providers
│           ├── __init__.py           # Service package initializer
│           ├── elasticsearch_service.py # Async Elasticsearch client wrapper
│           ├── ingest_service.py     # File ingestion orchestrator & routing layer
│           └── schema_service.py     # Elasticsearch template mapping configurations
└── frontend/
    ├── package.json                  # NPM packages, dependencies, and build commands
    ├── tsconfig.json                 # TypeScript compiler setup
    ├── next.config.ts                # Next.js configurations & API proxy rewrites
    ├── postcss.config.mjs            # PostCSS tailwind integration
    ├── eslint.config.mjs             # ESLint code linting configurations
    ├── AGENTS.md                     # Next.js agent execution rules
    └── src/
        ├── lib/
        │   └── api.ts                # Centralized typed API client for backend communication
        ├── app/                      # App router page folders
        │   ├── globals.css           # Global cyberpunk glassmorphic theme styling rules
        │   ├── layout.tsx            # Base HTML page template, fonts, and metadata setup
        │   ├── page.tsx              # Overview Dashboard (GSAP animations, TCS dial, Live terminal log simulation)
        │   ├── alerts/               # Alerts & Triage page
        │   │   └── page.tsx          # MITRE ATT&CK mapped alert catalog
        │   ├── evidence/             # Evidence Browser page
        │   │   └── page.tsx          # 9 forensic categories details view
        │   ├── models/               # ML Engine page
        │   │   └── page.tsx          # Formulations of the 6 core ML models
        │   ├── pipeline/             # Data Ingestion Pipeline page
        │   │   └── page.tsx          # ELK status, index metrics, and manual drag-and-drop file upload
        │   └── reports/              # Reports page
        │       └── page.tsx          # NIST SP 800-86 case report & chain-of-custody audit exports
        └── components/               # Shareable React components
            ├── AppShell.tsx          # Responsive Sidebar / Header wrapper shell
            ├── Header.tsx            # Topbar search field, notifications dropdown, and system indicators
            └── Sidebar.tsx           # Cyberpunk side-navigation menu links
```

---

## ⚙️ Root Infrastructure Configurations

### 📄 [.env](file:///c:/Users/dhruv/Documents/AI-DFIR/.env) (23 Lines)
*   **Purpose:** Central environment variable template that configures backend and database parameters.
*   **Key Section Breakdown:**
    *   **Lines 4-6:** Elasticsearch connection string (`ELASTICSEARCH_URL=http://localhost:9200`) and target index prefix (`ELASTICSEARCH_INDEX_PREFIX=dfir`).
    *   **Line 9:** Kibana user interface URL (`KIBANA_URL=http://localhost:5601`).
    *   **Lines 12-14:** API binding config (`API_HOST=0.0.0.0`, `API_PORT=8000`) and accepted CORS hosts.
    *   **Line 17:** JVM heap bounds configured for Elasticsearch (`ES_JAVA_OPTS=-Xms1g -Xmx1g`).
    *   **Lines 20-22:** FastAPI instance details (`APP_NAME`, `APP_VERSION`, `DEBUG`).

### 📄 [docker-compose.yml](file:///c:/Users/dhruv/Documents/AI-DFIR/docker-compose.yml) (80 Lines)
*   **Purpose:** Configures multi-container deployments for local validation and production container hosting.
*   **Key Section Breakdown:**
    *   **Lines 6-31 (`elasticsearch`):** Pulls Elasticsearch `8.15.0`, overrides authentication configurations for sandbox simplicity (`xpack.security.enabled=false`), binds local ports `9200`/`9300`, persists logs to `es-data` local volume, and defines a standard cluster health check running curl.
    *   **Lines 33-45 (`kibana`):** Pulls Kibana `8.15.0`, maps dependencies to the Elasticsearch container, and serves the UI on port `5601`.
    *   **Lines 48-69 (`dfir-api`):** Builds backend container using contextual Dockerfiles, feeds elasticsearch service strings, mounts relative backend codebase folders, and exposes API endpoint port `8000`.

---

## 🐍 Backend Framework (Python + FastAPI)

### 📄 [backend/Dockerfile](file:///c:/Users/dhruv/Documents/AI-DFIR/backend/Dockerfile) (20 Lines)
*   **Purpose:** Commands to compile the Python container environment.
*   **Key Section Breakdown:**
    *   **Line 1:** Pulls lightweight python base image `python:3.11-slim`.
    *   **Lines 6-8:** Runs `apt-get update` installing essential compilation dependencies (`gcc`) and sweeps package listings cache to optimize image sizing.
    *   **Lines 11-12:** Copies `requirements.txt` into container and executes pip installations.
    *   **Lines 15-19:** Copies relative folders, maps target port `8000`, and triggers Uvicorn hot-reloads.

### 📄 [backend/requirements.txt](file:///c:/Users/dhruv/Documents/AI-DFIR/backend/requirements.txt) (11 Lines)
*   **Purpose:** Lists exact Python dependencies.
*   **Key Section Breakdown:**
    *   **Lines 2-3:** FastAPI framework (`fastapi==0.115.12`) and server engine (`uvicorn[standard]==0.34.3`).
    *   **Line 4:** Async driver bindings for database indexing (`elasticsearch[async]==8.18.0`).
    *   **Lines 5-7:** Dotenv loading helpers and Pydantic validation structures.
    *   **Line 9:** Windows Event Log parser engine dependency (`python-evtx==0.7.4`).
    *   **Line 10:** Async filesystem handler library (`aiofiles==24.1.0`).

### 📄 [backend/app/config.py](file:///c:/Users/dhruv/Documents/AI-DFIR/backend/app/config.py) (45 Lines)
*   **Purpose:** Parses `.env` settings into typed variables using `pydantic-settings`.
*   **Key Section Breakdown:**
    *   **Lines 11-35 (`Settings`):** Declares pydantic settings validation model tracking defaults for Elasticsearch, Kibana, API cors, directories, and version info.
    *   **Lines 37-41 (`model_config`):** Pulls from relative env files (`../.env`) case-insensitively.
    *   **Line 44 (`settings`):** Instantiates Settings object singleton exported globally.

### 📄 [backend/app/main.py](file:///c:/Users/dhruv/Documents/AI-DFIR/backend/app/main.py) (88 Lines)
*   **Purpose:** Main application entry point, lifecycle context management, CORS middleware setup, and routing.
*   **Key Section Breakdown:**
    *   **Lines 28-53 (`lifespan`):** Handles async startup and shutdown. Checks connection to Elasticsearch (Line 36), triggers indexing template verification (Line 40), creates relative file uploads directories (Line 46), and cleanly closes async database sockets on shutdown (Line 52).
    *   **Lines 56-61 (`app`):** Instantiates FastAPI instance mapping metadata descriptors.
    *   **Lines 64-71:** Normalizes cors list configurations and appends `CORSMiddleware`.
    *   **Lines 74-76:** Mounts API Router instances (`health`, `pipeline`, `artifacts`).
    *   **Lines 79-87 (`root`):** Health validation endpoint returning API info.

### 📁 backend/app/schemas/
Pydantic data schemas used to validate inputs/outputs at the API gateway layer.

#### 📄 [artifacts.py](file:///c:/Users/dhruv/Documents/AI-DFIR/backend/app/schemas/artifacts.py) (127 Lines)
*   **Purpose:** Houses exact schemas for the 9 forensic artifact types.
*   **Key Section Breakdown:**
    *   **Lines 13-23 (`SystemLog`):** Schema for logs containing timestamp, event ID, source, level, channel, computer, message, and process details.
    *   **Lines 26-35 (`BrowserHistory`):** Schema for web history including URL, visit time, count, profile, and transition details.
    *   **Lines 38-46 (`RegistryEntry`):** Schema for Registry hives (NTUSER.DAT, SYSTEM, etc.), tracking key path, value name, data type, last written, and suspicion flags.
    *   **Lines 49-59 (`MemoryProcess`):** Schema for Volatility process metrics (PID, PPID, name, DLLs, and malfind hits).
    *   **Lines 61-73 (`NetworkPacket`):** Schema for PCAP packets tracking protocols, size, and payload entropy.
    *   **Lines 76-89 (`FileMetadata`):** Schema for file metadata (path, hashes, sizes, MACB timestamps, entropy).
    *   **Lines 92-102 (`ProcessTrace`):** Schema for Shimcache/Prefetch process executions.
    *   **Lines 105-114 (`ShellLog`):** Schema for command shell logs tracking user executions and base64 payloads.
    *   **Lines 117-127 (`USBDevice`):** Schema for USB connections tracking device IDs, vendors, and mount logs.

#### 📄 [pipeline.py](file:///c:/Users/dhruv/Documents/AI-DFIR/backend/app/schemas/pipeline.py) (39 Lines)
*   **Purpose:** Defines schemas for pipeline health status and ingestion outcomes.
*   **Key Section Breakdown:**
    *   **Lines 8-16 (`PipelineStatus`):** Status schema containing health fields, ES version, index count, and total documents.
    *   **Lines 18-26 (`IndexStatus`):** Document counts and byte sizes for individual Elasticsearch indices.
    *   **Lines 28-39 (`IngestResult`):** File parsing metrics, errors, duration, and completion statuses.

### 📁 backend/app/services/
Encapsulates backend business logic and database interactions.

#### 📄 [elasticsearch_service.py](file:///c:/Users/dhruv/Documents/AI-DFIR/backend/app/services/elasticsearch_service.py) (195 Lines)
*   **Purpose:** Async wrapper for the client communicating with the Elasticsearch cluster.
*   **Key Section Breakdown:**
    *   **Lines 25-56 (`connect`):** Establishes connectivity asynchronously, checks version info, and logs status.
    *   **Lines 69-83 (`health`):** Retrieves cluster status, node count, and shard health.
    *   **Lines 85-102 (`create_index`):** Creates indices in ES mapping fields to specific structural types.
    *   **Lines 104-125 (`bulk_ingest`):** Optimizes database performance by batch indexing documents inside ES bulk payloads.
    *   **Lines 126-158 (`search`):** Full-text multi-match search engine wrapper.
    *   **Lines 159-181 (`get_index_stats`):** Tallies document totals and storage sizing indices.
    *   **Lines 183-190 (`_format_bytes`):** Helper converting byte sizes into KB/MB/GB strings.
    *   **Line 194:** Exports the `es_service` singleton.

#### 📄 [schema_service.py](file:///c:/Users/dhruv/Documents/AI-DFIR/backend/app/services/schema_service.py) (176 Lines)
*   **Purpose:** Defines schemas and index configurations for the 9 categories of forensic artifacts.
*   **Key Section Breakdown:**
    *   **Lines 18-145 (`INDEX_SCHEMAS`):** Dictionary mapping data keys (`system-logs`, `browser-history`, `registry-hives`, etc.) to index configurations (e.g., date formats, keywords, unindexed raw XML strings, nested network arrays).
    *   **Lines 151-158 (`ensure_all_indices`):** Loops over index patterns and creates them on startup.
    *   **Lines 160-171:** Helpers to retrieve names, schemas, and categories.

#### 📄 [ingest_service.py](file:///c:/Users/dhruv/Documents/AI-DFIR/backend/app/services/ingest_service.py) (127 Lines)
*   **Purpose:** Orchestrates file parsing and database indexing.
*   **Key Section Breakdown:**
    *   **Lines 23-29 (`FILE_TYPE_MAP`):** Maps file extensions (`.evtx`, `.log`, `.sqlite`, etc.) to specific parsing helpers.
    *   **Lines 38-46 (`detect_file_type`):** Matches upload formats to respective parser functions.
    *   **Lines 48-122 (`ingest_file`):** Receives file, executes its parser to extract documents, streams bulk batches in BATCH_SIZE increments (500 items, Lines 100-104), and updates execution times.

### 📁 backend/app/parsers/
Forensic parsers that extract raw binary artifacts into normalized Python dictionaries.

#### 📄 [evtx_parser.py](file:///c:/Users/dhruv/Documents/AI-DFIR/backend/app/parsers/evtx_parser.py) (133 Lines)
*   **Purpose:** Extracts details from Windows Event Logs (`.evtx`).
*   **Key Section Breakdown:**
    *   **Lines 16-25 (`parse_evtx_file`):** Function generator that reads logs and yields normalized dictionaries.
    *   **Lines 27-32:** Dynamically imports `Evtx` and XML utilities.
    *   **Lines 43-44:** Opens the `.evtx` file, loop-scanning event record frames.
    *   **Lines 49-52:** Registers event schema XML namespaces (`http://schemas.microsoft.com/win/2004/08/events/event`).
    *   **Lines 59-80:** Pulls standard header values (`EventID`, `TimeCreated`, `Provider`, `Level`, `Channel`, `Computer`).
    *   **Lines 82-93:** Parses parameter elements inside `EventData` elements.
    *   **Lines 96-107:** Pulls execution Process IDs and security User SIDs.
    *   **Lines 109-123:** Returns logs containing fields formatted for Elasticsearch.

#### 📄 [sqlite_parser.py](file:///c:/Users/dhruv/Documents/AI-DFIR/backend/app/parsers/sqlite_parser.py) (212 Lines)
*   **Purpose:** Parses web browser databases (Chrome, Edge, and Firefox history) using Python's built-in SQLite client.
*   **Key Section Breakdown:**
    *   **Lines 23-43:** Handles browser time formatting. Converts WebKit epochs (microseconds since Jan 1, 1601) and Mozilla epochs (microseconds since Jan 1, 1970) to ISO timestamps.
    *   **Lines 45-119 (`parse_chrome_history`):** Establishes read-only connection (Line 64), queries Chrome's `urls` and `visits` database tables, translates transition IDs, and yields historical visit details.
    *   **Lines 121-191 (`parse_firefox_history`):** Performs similar database query against Firefox's `moz_places` and `moz_historyvisits` tables.
    *   **Lines 193-212 (`parse_browser_sqlite`):** Automatically detects database type, parses history entries, and returns them.

#### 📄 [syslog_parser.py](file:///c:/Users/dhruv/Documents/AI-DFIR/backend/app/parsers/syslog_parser.py) (131 Lines)
*   **Purpose:** Parses Linux syslog entries into structured JSON.
*   **Key Section Breakdown:**
    *   **Lines 18-24 (`SYSLOG_PATTERN`):** Regular expression matching standard priority headers, dates, servers, daemon processes, PIDs, and message contents.
    *   **Lines 27-44:** Maps numeric codes to syslog facility and severity levels (RFC 5424).
    *   **Lines 47-130 (`parse_syslog_file`):** Generator scanning log files line-by-line (Line 72). Regex matches (Line 77) priority codes, adds current year context (Line 105), maps PIDs, and yields parsed logs. If lines mismatch patterns, it returns them as raw unstructured logs to ensure data retention (Line 80).

### 📁 backend/app/routers/
FastAPI endpoint routes that expose pipeline controls and query interfaces.

#### 📄 [health.py](file:///c:/Users/dhruv/Documents/AI-DFIR/backend/app/routers/health.py) (53 Lines)
*   **Purpose:** Diagnostic dashboard health endpoints.
*   **Key Section Breakdown:**
    *   **Lines 12-26 (`health_check`):** Verifies backend API and Elasticsearch connections.
    *   **Lines 29-52 (`elasticsearch_health`):** Gathers index storage volumes, overall counts, and status details.

#### 📄 [pipeline.py](file:///c:/Users/dhruv/Documents/AI-DFIR/backend/app/routers/pipeline.py) (123 Lines)
*   **Purpose:** Ingest control endpoints.
*   **Key Section Breakdown:**
    *   **Lines 20-50 (`pipeline_status`):** Resolves operational status and sizes of index pipelines.
    *   **Lines 66-123 (`ingest_file`):** File upload endpoint. Validates file format based on extension (Lines 77-83), ensures file sizes don't exceed limits (Lines 93-97), writes files to an upload folder, triggers parsing via `ingest_service` (Line 111), and deletes temporary files upon completion (Line 121).

#### 📄 [artifacts.py](file:///c:/Users/dhruv/Documents/AI-DFIR/backend/app/routers/artifacts.py) (155 Lines)
*   **Purpose:** Core REST API endpoints used to search and filter parsed forensic data.
*   **Key Section Breakdown:**
    *   **Lines 15-68 (`search_artifacts`):** Full-text fuzzy search endpoint (`/search`). Searches fields (`message`, `command`, `url`, `path`, etc.) using Elasticsearch's `multi_match` queries (Lines 37-54).
    *   **Lines 71-94 (`list_categories`):** Returns index volumes and details for the 9 categories.
    *   **Lines 97-130 (`list_artifacts`):** Fetches sorted logs within a specific category index.
    *   **Lines 133-154 (`get_artifact`):** Fetches single document details by ID.

---

## 🎨 Frontend Framework (Next.js App Router)

### 📄 [frontend/package.json](file:///c:/Users/dhruv/Documents/AI-DFIR/frontend/package.json) (30 Lines)
*   **Purpose:** Node.js script commands and package dependencies.
*   **Key Section Breakdown:**
    *   **Lines 5-10 (`scripts`):** Next.js build and script actions (`dev`, `build`, `start`, `lint`).
    *   **Lines 12-13:** GSAP animation components (`gsap` and `@gsap/react`).
    *   **Line 14:** Lucide interface icons (`lucide-react`).
    *   **Lines 15-17:** Framework dependencies (`next 16.2.9`, `react 19.2.4`).

### 📄 [frontend/tsconfig.json](file:///c:/Users/dhruv/Documents/AI-DFIR/frontend/tsconfig.json)
*   **Purpose:** Configures the TypeScript compiler, enabling alias paths (e.g. `@/*` maps to `src/*`).

### 📄 [frontend/next.config.ts](file:///c:/Users/dhruv/Documents/AI-DFIR/frontend/next.config.ts)
*   **Purpose:** Next.js framework configuration.
*   **Key Section Breakdown:**
    *   **`rewrites`:** Proxies `/api/*` requests to the FastAPI backend (`http://localhost:8000/api/*`) to bypass CORS restrictions during development.

### 📁 frontend/src/lib/
#### 📄 [api.ts](file:///c:/Users/dhruv/Documents/AI-DFIR/frontend/src/lib/api.ts)
*   **Purpose:** Centralized API client connecting the frontend UI to the FastAPI backend.
*   **Key Section Breakdown:**
    *   **Types:** Interfaces for `HealthResponse`, `PipelineStatus`, `IngestResult`, and search hits.
    *   **Helpers:** `fetchJSON` wrapper that gracefully catches errors and returns fallback offline data instead of crashing the UI.
    *   **Endpoints:** Wrappers for `/health`, `/pipeline/status`, `/pipeline/ingest`, `/artifacts/categories`, and `/artifacts/search`.

### 📄 [frontend/src/app/globals.css](file:///c:/Users/dhruv/Documents/AI-DFIR/frontend/src/app/globals.css) (269 Lines)
*   **Purpose:** Central stylesheet defining animations and custom cyberpunk themes.
*   **Key Section Breakdown:**
    *   **Lines 3-9 (`:root`):** Defines cyberpunk background variables (dark background, glowing cyans/pinks).
    *   **Lines 22-36:** Custom scrollbar styles.
    *   **Lines 38-129 (`@keyframes`):** Animations for background glows (`cyanPulse`, `pulseGlow`), fade-ins (`fadeInUp`), CRT terminal lines (`scanline`), visual glitches (`glitch`), card glows (`borderGlow`), and dial animations (`dialSweep`).
    *   **Lines 131-168:** CSS utility classes for keyframe animations.
    *   **Lines 180-191 (`.glass`):** Cyberpunk frosted glass style (backdrop blur and subtle borders).
    *   **Lines 241-251 (`.terminal-scanline`):** Simulates CRT monitors with scanline animations.

### 📄 [frontend/src/app/layout.tsx](file:///c:/Users/dhruv/Documents/AI-DFIR/frontend/src/app/layout.tsx) (44 Lines)
*   **Purpose:** Root layout that configures typography and page metadata.
*   **Key Section Breakdown:**
    *   **Lines 6-20:** Configures Google fonts (`Orbitron` for headers, `Space_Grotesk` for text, `Space_Mono` for code).
    *   **Lines 22-26 (`metadata`):** SEO configuration for headers and title tags.
    *   **Lines 28-43 (`RootLayout`):** Implements typography classes and wraps child pages inside the `AppShell` component.

### 📁 frontend/src/components/
Reusable UI layout elements shared across pages.

#### 📄 [AppShell.tsx](file:///c:/Users/dhruv/Documents/AI-DFIR/frontend/src/components/AppShell.tsx) (44 Lines)
*   **Purpose:** Implements a responsive sidebar navigation menu for mobile and desktop screens.
*   **Key Section Breakdown:**
    *   **Lines 18-21:** Semitransparent mobile background overlays.
    *   **Lines 24-30:** Renders `Sidebar` using transform translations for smooth transitions.
    *   **Lines 33-39:** Renders `Header` alongside scrollable main containers.

#### 📄 [Header.tsx](file:///c:/Users/dhruv/Documents/AI-DFIR/frontend/src/components/Header.tsx)
*   **Purpose:** Header bar containing status indicators, real-time search inputs, and alert logs.
*   **Key Section Breakdown:**
    *   **Lines 6-28 (`RECENT_NOTIFICATIONS`):** Mock data for critical and high notifications.
    *   **Search Engine:** Fuzzy search input field that hits the `GET /api/artifacts/search` backend endpoint with a 350ms debounce, rendering real indexed documents in a dropdown.
    *   **Status Indicators:** Glowing active status dot ("SYSTEM ONLINE").
    *   **`BellDropdown`:** Notification dropdown. Renders list arrays, severity tags, and details on click.

#### 📄 [Sidebar.tsx](file:///c:/Users/dhruv/Documents/AI-DFIR/frontend/src/components/Sidebar.tsx) (107 Lines)
*   **Purpose:** Sidebar containing navigation links and logo.
*   **Key Section Breakdown:**
    *   **Lines 16-23 (`navigation`):** Navigation links mapped to page URLs and icons.
    *   **Lines 53-82:** Loops through navigation arrays, applying active tab indicator bars (Line 68) and custom fade-in animation delays (Line 60).
    *   **Lines 87-94:** Displays case context and phase info.

### 📁 frontend/src/app/ (Pages)
Dashboard views and diagnostic modules.

#### 📄 [page.tsx](file:///c:/Users/dhruv/Documents/AI-DFIR/frontend/src/app/page.tsx) (675 Lines)
*   **Purpose:** The main overview dashboard. Shows active indicators, threat metrics, logs, and workflow pipelines.
*   **Key Section Breakdown:**
    *   **Lines 29-53 (`useCounter`):** Custom hook that implements numeric count-up animations using easing functions.
    *   **Live Data:** Fetches live index statistics from the backend (`GET /api/pipeline/status`) to populate the real "Evidence Parsed" document count, auto-refreshing every 30 seconds.
    *   **Lines 121-167 (`AnimatedStatCard`):** Card component that applies the count-up hook to metrics (Alerts, PCAP Pkt/s, CPU).
    *   **Lines 170-230 (`LiveTerminal`):** Interactive diagnostic logger. Uses interval timers to simulate a live console feed, displaying parsed commands and system anomalies (Lines 102-118).
    *   **Lines 233-674 (`Dashboard`):** Main layout.
        *   **Lines 238-262:** Uses `gsap` scroll triggers to animate dashboard rows as the user scrolls.
        *   **Lines 307-337:** Renders a circular SVG dial to display the Threat Confidence Score (TCS), using stroke offsets to animate progress (Line 330).
        *   **Lines 349-364:** Renders the Bayesian Threat Confidence Score range scale.
        *   **Lines 385-424:** Grid displaying progress bars and metrics for the 6 ML models.
        *   **Lines 439-467:** Displays active statuses for the 5 architecture layers.
        *   **Lines 484-536:** NIST SP 800-86 workflow timeline.
        *   **Lines 549-586:** Interactive cards detailing the 9 forensic artifact categories.
        *   **Lines 601-670:** Data table listing recent critical alerts.

#### 📄 [alerts/page.tsx](file:///c:/Users/dhruv/Documents/AI-DFIR/frontend/src/app/alerts/page.tsx) (130 Lines)
*   **Purpose:** Detailed alerts catalog that groups anomalies by severity.
*   **Key Section Breakdown:**
    *   **Lines 5-62 (`ALERTS_DATA`):** Array containing mock alerts (e.g. svchost memory injection, base64 shell log indicators) mapped to MITRE ATT&CK tactics.
    *   **Lines 64-69 (`SeverityIcon`):** Maps alert severities to specific interface icons.
    *   **Lines 96-126:** Renders the main data table, using color-coded badges to denote severity (Critical, High, Medium, Low).

#### 📄 [evidence/page.tsx](file:///c:/Users/dhruv/Documents/AI-DFIR/frontend/src/app/evidence/page.tsx)
*   **Purpose:** Explains the 9 forensic categories analyzed by the framework and allows browsing of live indexed data.
*   **Key Section Breakdown:**
    *   **`CATEGORY_INFO`:** Array defining the purpose, targets (e.g., MFT tables, C2 beacons, mounting history), and icons for each category.
    *   **Live Metrics:** Hits the backend API to fetch real document counts for each category index.
    *   **Interactive Viewer:** Includes an expandable dropdown on each card that queries Elasticsearch (`GET /api/artifacts/{category}`) and renders actual normalized forensic log hits inline.

#### 📄 [models/page.tsx](file:///c:/Users/dhruv/Documents/AI-DFIR/frontend/src/app/models/page.tsx) (107 Lines)
*   **Purpose:** Lists the formulas, categories, and metrics for the 6 Machine Learning models.
*   **Key Section Breakdown:**
    *   **Lines 5-48 (`ML_MODELS`):** Array defining formulas (e.g. Shannon Entropy $H(X)$, GMM probability densities $f(x)$, Euclidean distances $d$) and performance statistics for each model.
    *   **Lines 70-104:** Cards showing formulas, icons, and description text for each model.

#### 📄 [pipeline/page.tsx](file:///c:/Users/dhruv/Documents/AI-DFIR/frontend/src/app/pipeline/page.tsx)
*   **Purpose:** Ingest monitoring page. Shows LIVE database indexing metrics, stack statuses, and functional file upload areas.
*   **Key Section Breakdown:**
    *   **Live Statuses:** Hits `GET /api/health` and `GET /api/pipeline/status` to render real connectivity indicators for Elasticsearch, Kibana, and the FastAPI backend, plus live document counts across all 9 indices.
    *   **Functional Upload Zone:** An interactive drag-and-drop file upload target that pushes files (e.g., `.evtx`, `.sqlite`) to `POST /api/pipeline/ingest` via FormData.
    *   **Ingestion Toasts:** Renders success/error banners dynamically based on the backend's parsing response (showing documents parsed, indexed, and duration).
    *   **Offline Resilience:** Gracefully degrades to show "Elasticsearch is disconnected" warnings if the backend is unreachable, rather than crashing.

#### 📄 [reports/page.tsx](file:///c:/Users/dhruv/Documents/AI-DFIR/frontend/src/app/reports/page.tsx) (496 Lines)
*   **Purpose:** Generates incident reports. Includes case details, chain-of-custody logs, and exports.
*   **Key Section Breakdown:**
    *   **Lines 23-35 (`CASE_INFO`):** Case metadata (ID, started, status, threat score, document metrics).
    *   **Lines 38-89 (`EVIDENCE_CHAIN`):** Evidence metadata (filename, size, acquisition times, cryptographic hashes) used to preserve the chain of custody.
    *   **Lines 92-141 (`MITRE_FINDINGS`):** Array mapping detected indicators (e.g. CobaltStrike, LSASS dump) to MITRE ATT&CK techniques.
    *   **Lines 193-248:** Summary stat cards.
    *   **Lines 254-284:** Grid listing case metadata.
    *   **Lines 318-378:** Renders the Chain of Custody database table, which displays evidence file details and SHA-256 hashes to guarantee data integrity.
    *   **Lines 381-463:** Grid showing details for MITRE ATT&CK tactic findings.
    *   **Lines 466-493:** Compliance details (NIST SP 800-86) and PDF export actions.
