"""
Syslog Parser

Parses standard syslog format (RFC 3164 / RFC 5424) files into
normalized JSON documents for Elasticsearch ingestion.
"""

import re
import logging
from datetime import datetime
from typing import Generator
from pathlib import Path

logger = logging.getLogger("dfir.parser.syslog")

# RFC 3164 syslog pattern:
# <priority>timestamp hostname process[pid]: message
SYSLOG_PATTERN = re.compile(
    r"^(?:<(\d+)>)?"                        # Optional priority
    r"(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})"  # Timestamp (e.g., Jun 17 10:42:01)
    r"\s+(\S+)"                              # Hostname
    r"\s+(\S+?)(?:\[(\d+)\])?:"             # Process name [optional PID]
    r"\s*(.*)$"                              # Message
)

# Priority to severity mapping (RFC 5424)
SEVERITY_MAP = {
    0: "Emergency",
    1: "Alert",
    2: "Critical",
    3: "Error",
    4: "Warning",
    5: "Notice",
    6: "Information",
    7: "Debug",
}

FACILITY_MAP = {
    0: "kern", 1: "user", 2: "mail", 3: "daemon",
    4: "auth", 5: "syslog", 6: "lpr", 7: "news",
    8: "uucp", 9: "cron", 10: "authpriv", 11: "ftp",
    16: "local0", 17: "local1", 18: "local2", 19: "local3",
    20: "local4", 21: "local5", 22: "local6", 23: "local7",
}


def parse_syslog_file(file_path: str, year: int | None = None) -> Generator[dict, None, None]:
    """
    Parse a syslog file and yield normalized documents.

    Args:
        file_path: Path to the syslog file
        year: Year to use for timestamps (syslog doesn't include year).
              Defaults to current year.

    Yields:
        Normalized event dictionaries
    """
    path = Path(file_path)
    if not path.exists():
        logger.error(f"File not found: {file_path}")
        return

    if year is None:
        year = datetime.now().year

    logger.info(f"Parsing syslog file: {path.name}")
    count = 0

    try:
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                if not line:
                    continue

                match = SYSLOG_PATTERN.match(line)
                if not match:
                    # Try to emit as raw if no match
                    yield {
                        "timestamp": datetime.now().isoformat(),
                        "event_id": 0,
                        "source": "syslog",
                        "level": "Information",
                        "channel": "syslog",
                        "computer": "unknown",
                        "message": line,
                    }
                    count += 1
                    continue

                priority_str, timestamp_str, hostname, process, pid_str, message = (
                    match.groups()
                )

                # Parse priority into facility and severity
                priority = int(priority_str) if priority_str else 14  # default: user.info
                facility_code = priority >> 3
                severity_code = priority & 0x07
                level = SEVERITY_MAP.get(severity_code, "Information")
                facility = FACILITY_MAP.get(facility_code, "user")

                # Parse timestamp (add year since syslog omits it)
                try:
                    ts = datetime.strptime(f"{year} {timestamp_str}", "%Y %b %d %H:%M:%S")
                    timestamp = ts.isoformat()
                except ValueError:
                    timestamp = datetime.now().isoformat()

                # Parse PID
                process_id = int(pid_str) if pid_str else None

                doc = {
                    "timestamp": timestamp,
                    "event_id": priority,
                    "source": f"{facility}/{process}",
                    "level": level,
                    "channel": facility,
                    "computer": hostname,
                    "message": message,
                    "process_id": process_id,
                }

                count += 1
                yield doc

    except Exception as e:
        logger.error(f"Failed to parse syslog file: {e}")

    logger.info(f"Parsed {count} lines from {path.name}")
