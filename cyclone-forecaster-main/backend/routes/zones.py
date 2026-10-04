from fastapi import APIRouter, HTTPException, Query
import database
import ai_engine

router = APIRouter(prefix="/zones", tags=["zones"])


@router.get("")
def list_zones():
    return database.get_all_zones()


@router.get("/{zone_id}")
def get_zone(zone_id: str):
    zone = database.get_zone(zone_id)
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    return zone


@router.get("/{zone_id}/risk-assessment")
def get_risk_assessment(zone_id: str, cyclone_id: str = Query(default=None)):
    zone = database.get_zone(zone_id)
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")

    cyclone = database.get_cyclone(cyclone_id) if cyclone_id else database.get_default_cyclone()
    if not cyclone:
        raise HTTPException(status_code=404, detail="Cyclone not found")

    assessment = ai_engine.assess_zone(cyclone, zone)
    return {
        "zone_id": zone_id,
        "zone_name": zone["name"],
        "cyclone_id": cyclone["id"],
        "cyclone_name": cyclone["name"],
        **assessment,
    }