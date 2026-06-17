"""
Windows Event Log (.evtx) Parser

Parses .evtx files into normalized JSON documents for Elasticsearch ingestion.
Uses the python-evtx library for XML extraction.
"""

import logging
from datetime import datetime
from typing import Generator
from pathlib import Path

logger = logging.getLogger("dfir.parser.evtx")


def parse_evtx_file(file_path: str) -> Generator[dict, None, None]:
    """
    Parse a Windows Event Log .evtx file and yield normalized documents.

    Args:
        file_path: Path to the .evtx file

    Yields:
        Normalized event dictionaries ready for Elasticsearch ingestion
    """
    try:
        import Evtx.Evtx as evtx
        import Evtx.Views as views
        import xml.etree.ElementTree as ET
    except ImportError:
        logger.error("python-evtx not installed. Run: pip install python-evtx")
        return

    path = Path(file_path)
    if not path.exists():
        logger.error(f"File not found: {file_path}")
        return

    logger.info(f"Parsing EVTX file: {path.name}")
    count = 0

    try:
        with evtx.Evtx(str(path)) as log:
            for record in log.records():
                try:
                    xml_str = record.xml()
                    root = ET.fromstring(xml_str)

                    # Namespace handling for Windows Event Log XML
                    ns = {
                        "evt": "http://schemas.microsoft.com/win/2004/08/events/event"
                    }

                    # Extract System fields
                    system = root.find("evt:System", ns)
                    if system is None:
                        continue

                    event_id_el = system.find("evt:EventID", ns)
                    event_id = int(event_id_el.text) if event_id_el is not None and event_id_el.text else 0

                    time_el = system.find("evt:TimeCreated", ns)
                    timestamp = (
                        time_el.get("SystemTime", "") if time_el is not None else ""
                    )

                    provider_el = system.find("evt:Provider", ns)
                    source = provider_el.get("Name", "") if provider_el is not None else ""

                    level_el = system.find("evt:Level", ns)
                    level_map = {0: "Information", 1: "Critical", 2: "Error", 3: "Warning", 4: "Information"}
                    level_val = int(level_el.text) if level_el is not None and level_el.text else 4
                    level = level_map.get(level_val, "Information")

                    channel_el = system.find("evt:Channel", ns)
                    channel = channel_el.text if channel_el is not None else ""

                    computer_el = system.find("evt:Computer", ns)
                    computer = computer_el.text if computer_el is not None else ""

                    # Extract EventData message
                    event_data = root.find("evt:EventData", ns)
                    message_parts = []
                    if event_data is not None:
                        for data_el in event_data:
                            name = data_el.get("Name", "")
                            value = data_el.text or ""
                            if name:
                                message_parts.append(f"{name}={value}")
                            elif value:
                                message_parts.append(value)

                    message = " | ".join(message_parts) if message_parts else ""

                    # Process ID
                    execution_el = system.find("evt:Execution", ns)
                    process_id = None
                    if execution_el is not None:
                        pid_str = execution_el.get("ProcessID", "")
                        if pid_str:
                            process_id = int(pid_str)

                    # Security / User SID
                    security_el = system.find("evt:Security", ns)
                    user_sid = None
                    if security_el is not None:
                        user_sid = security_el.get("UserID")

                    doc = {
                        "timestamp": timestamp,
                        "event_id": event_id,
                        "source": source,
                        "level": level,
                        "channel": channel,
                        "computer": computer,
                        "message": message,
                        "user_sid": user_sid,
                        "process_id": process_id,
                        "raw_xml": xml_str,
                    }

                    count += 1
                    yield doc

                except Exception as e:
                    logger.warning(f"Failed to parse record: {e}")
                    continue

    except Exception as e:
        logger.error(f"Failed to open EVTX file: {e}")

    logger.info(f"Parsed {count} events from {path.name}")
