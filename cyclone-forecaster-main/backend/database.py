import json
from pathlib import Path
from typing import Dict, List, Optional

SEED_PATH = Path(__file__).parent / "seed_data.json"

cyclones: Dict[str, dict] = {}
zones: Dict[str, dict] = {}


def load_seed_data():
    global cyclones, zones
    with open(SEED_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    cyclones = {c["id"]: c for c in data["cyclones"]}
    zones = {z["id"]: z for z in data["zones"]}


def get_all_cyclones() -> List[dict]:
    return list(cyclones.values())


def get_cyclone(cyclone_id: str) -> Optional[dict]:
    return cyclones.get(cyclone_id)


def get_default_cyclone() -> dict:
    return next(iter(cyclones.values()))


def get_all_zones() -> List[dict]:
    return list(zones.values())


def get_zone(zone_id: str) -> Optional[dict]:
    return zones.get(zone_id)