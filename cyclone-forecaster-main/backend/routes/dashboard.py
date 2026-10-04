from fastapi import APIRouter, Query
import database
import ai_engine

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("")
def get_dashboard(cyclone_id: str = Query(default=None)):
    cyclone = database.get_cyclone(cyclone_id) if cyclone_id else database.get_default_cyclone()
    entries = []
    for zone in database.get_all_zones():
        assessment = ai_engine.assess_zone(cyclone, zone)
        top_factor = assessment["key_factors"][0] if assessment["key_factors"] else ""
        entries.append({
            "zone_id": zone["id"],
            "zone_name": zone["name"],
            "district": zone["district"],
            "lat": zone["lat"],
            "lng": zone["lng"],
            "risk_level": assessment["risk_level"],
            "risk_score": assessment["risk_score"],
            "population_estimate": zone["population_estimate"],
            "top_factor": top_factor,
        })
    entries.sort(key=lambda e: e["risk_score"], reverse=True)
    return {"cyclone_id": cyclone["id"], "cyclone_name": cyclone["name"], "zones": entries}