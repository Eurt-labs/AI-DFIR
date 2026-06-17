"""
Browser SQLite Database Parser

Parses Chrome, Firefox, and Edge browser history databases (SQLite)
into normalized JSON documents for Elasticsearch ingestion.
"""

import sqlite3
import logging
from datetime import datetime, timedelta
from typing import Generator
from pathlib import Path

logger = logging.getLogger("dfir.parser.sqlite")

# Chrome/Edge timestamps are microseconds since 1601-01-01
CHROME_EPOCH = datetime(1601, 1, 1)

# Firefox timestamps are microseconds since Unix epoch
UNIX_EPOCH = datetime(1970, 1, 1)


def _chrome_timestamp(microseconds: int) -> str:
    """Convert Chrome/Edge timestamp to ISO format."""
    try:
        if microseconds <= 0:
            return datetime.now().isoformat()
        dt = CHROME_EPOCH + timedelta(microseconds=microseconds)
        return dt.isoformat()
    except (OverflowError, OSError):
        return datetime.now().isoformat()


def _firefox_timestamp(microseconds: int) -> str:
    """Convert Firefox timestamp to ISO format."""
    try:
        if microseconds <= 0:
            return datetime.now().isoformat()
        dt = UNIX_EPOCH + timedelta(microseconds=microseconds)
        return dt.isoformat()
    except (OverflowError, OSError):
        return datetime.now().isoformat()


def parse_chrome_history(file_path: str) -> Generator[dict, None, None]:
    """
    Parse a Chrome/Edge History SQLite database.

    Args:
        file_path: Path to the History SQLite file

    Yields:
        Normalized browser history documents
    """
    path = Path(file_path)
    if not path.exists():
        logger.error(f"File not found: {file_path}")
        return

    logger.info(f"Parsing Chrome/Edge history: {path.name}")
    count = 0

    try:
        conn = sqlite3.connect(f"file:{path}?mode=ro", uri=True)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        # Query URLs table joined with visits
        query = """
            SELECT 
                u.url,
                u.title,
                v.visit_time,
                u.visit_count,
                v.transition
            FROM urls u
            LEFT JOIN visits v ON u.id = v.url
            ORDER BY v.visit_time DESC
        """

        try:
            cursor.execute(query)
            for row in cursor.fetchall():
                visit_time = _chrome_timestamp(row["visit_time"] or 0)

                # Transition type mapping
                transition_map = {
                    0: "link", 1: "typed", 2: "auto_bookmark",
                    3: "auto_subframe", 4: "manual_subframe",
                    5: "generated", 6: "start_page", 7: "form_submit",
                    8: "reload", 9: "keyword", 10: "keyword_generated",
                }
                transition = transition_map.get(
                    (row["transition"] or 0) & 0xFF, "other"
                )

                doc = {
                    "url": row["url"],
                    "title": row["title"] or "",
                    "visit_time": visit_time,
                    "visit_count": row["visit_count"] or 1,
                    "browser": "Chrome",
                    "profile": "Default",
                    "transition_type": transition,
                }

                count += 1
                yield doc

        except sqlite3.OperationalError as e:
            logger.warning(f"Chrome query failed (possibly not a Chrome DB): {e}")

        conn.close()

    except Exception as e:
        logger.error(f"Failed to parse Chrome history: {e}")

    logger.info(f"Parsed {count} history entries from {path.name}")


def parse_firefox_history(file_path: str) -> Generator[dict, None, None]:
    """
    Parse a Firefox places.sqlite database.

    Args:
        file_path: Path to the places.sqlite file

    Yields:
        Normalized browser history documents
    """
    path = Path(file_path)
    if not path.exists():
        logger.error(f"File not found: {file_path}")
        return

    logger.info(f"Parsing Firefox history: {path.name}")
    count = 0

    try:
        conn = sqlite3.connect(f"file:{path}?mode=ro", uri=True)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        query = """
            SELECT 
                p.url,
                p.title,
                h.visit_date,
                p.visit_count,
                h.visit_type
            FROM moz_places p
            LEFT JOIN moz_historyvisits h ON p.id = h.place_id
            ORDER BY h.visit_date DESC
        """

        try:
            cursor.execute(query)
            for row in cursor.fetchall():
                visit_time = _firefox_timestamp(row["visit_date"] or 0)

                ff_transition_map = {
                    1: "link", 2: "typed", 3: "bookmark",
                    4: "embed", 5: "redirect_permanent",
                    6: "redirect_temporary", 7: "download",
                    8: "framed_link",
                }
                transition = ff_transition_map.get(row["visit_type"] or 0, "other")

                doc = {
                    "url": row["url"],
                    "title": row["title"] or "",
                    "visit_time": visit_time,
                    "visit_count": row["visit_count"] or 1,
                    "browser": "Firefox",
                    "profile": "Default",
                    "transition_type": transition,
                }

                count += 1
                yield doc

        except sqlite3.OperationalError as e:
            logger.warning(f"Firefox query failed: {e}")

        conn.close()

    except Exception as e:
        logger.error(f"Failed to parse Firefox history: {e}")

    logger.info(f"Parsed {count} history entries from {path.name}")


def parse_browser_sqlite(file_path: str) -> Generator[dict, None, None]:
    """
    Auto-detect and parse a browser SQLite database.
    Tries Chrome/Edge first, then Firefox.

    Args:
        file_path: Path to the SQLite database

    Yields:
        Normalized browser history documents
    """
    # Try Chrome/Edge first
    docs = list(parse_chrome_history(file_path))
    if docs:
        yield from docs
        return

    # Fallback to Firefox
    yield from parse_firefox_history(file_path)
