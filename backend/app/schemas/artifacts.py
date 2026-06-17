"""
Pydantic schemas for the 9 forensic artifact types.

Used for request/response validation in the API layer.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


# ── 1. System Logs ──
class SystemLog(BaseModel):
    timestamp: datetime
    event_id: int
    source: str
    level: str = Field(..., description="e.g., Information, Warning, Error, Critical")
    channel: Optional[str] = None
    computer: Optional[str] = None
    message: str
    user_sid: Optional[str] = None
    process_id: Optional[int] = None


# ── 2. Browser History ──
class BrowserHistory(BaseModel):
    url: str
    title: Optional[str] = None
    visit_time: datetime
    visit_count: int = 1
    browser: str = Field(..., description="e.g., Chrome, Firefox, Edge")
    profile: Optional[str] = None
    transition_type: Optional[str] = None
    duration_ms: Optional[int] = None


# ── 3. Registry Hives ──
class RegistryEntry(BaseModel):
    key_path: str
    value_name: Optional[str] = None
    value_data: Optional[str] = None
    value_type: Optional[str] = None
    last_written: Optional[datetime] = None
    hive: str = Field(..., description="e.g., NTUSER.DAT, SYSTEM, SOFTWARE, SAM")
    suspicious: bool = False


# ── 4. Memory Dumps ──
class MemoryProcess(BaseModel):
    pid: int
    process_name: str
    ppid: Optional[int] = None
    cmdline: Optional[str] = None
    create_time: Optional[datetime] = None
    num_threads: Optional[int] = None
    dlls: list[str] = Field(default_factory=list)
    malfind_hits: int = 0
    suspicious: bool = False


# ── 5. Network PCAP ──
class NetworkPacket(BaseModel):
    timestamp: datetime
    src_ip: str
    dst_ip: str
    src_port: Optional[int] = None
    dst_port: Optional[int] = None
    protocol: str
    length: int
    payload_entropy: Optional[float] = None
    flags: Optional[str] = None
    info: Optional[str] = None


# ── 6. File Metadata ──
class FileMetadata(BaseModel):
    path: str
    filename: str
    extension: Optional[str] = None
    hash_md5: Optional[str] = None
    hash_sha256: Optional[str] = None
    size_bytes: int
    modified: Optional[datetime] = None
    accessed: Optional[datetime] = None
    created: Optional[datetime] = None
    born: Optional[datetime] = None
    entropy: Optional[float] = None
    suspicious: bool = False


# ── 7. Process Traces ──
class ProcessTrace(BaseModel):
    executable: str
    path: Optional[str] = None
    run_count: int = 0
    last_run: Optional[datetime] = None
    source_artifact: str = Field(
        ..., description="e.g., Prefetch, Shimcache, Amcache"
    )
    hash_sha256: Optional[str] = None
    suspicious: bool = False


# ── 8. Shell Logs ──
class ShellLog(BaseModel):
    timestamp: Optional[datetime] = None
    command: str
    user: Optional[str] = None
    shell_type: str = Field(..., description="e.g., PowerShell, Bash, Zsh, Cmd")
    is_base64_encoded: bool = False
    is_download_cradle: bool = False
    decoded_content: Optional[str] = None
    suspicious: bool = False


# ── 9. USB Devices ──
class USBDevice(BaseModel):
    serial_number: str
    vendor: Optional[str] = None
    product: Optional[str] = None
    vendor_id: Optional[str] = None
    product_id: Optional[str] = None
    first_connected: Optional[datetime] = None
    last_connected: Optional[datetime] = None
    drive_letter: Optional[str] = None
    volume_name: Optional[str] = None
