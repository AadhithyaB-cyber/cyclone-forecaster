"""
Risk-assessment engine. Pure Python, weighted rule-based scoring —
no external API. Distance from landfall is computed dynamically via
haversine, so switching cyclone scenarios changes zone risk correctly.
"""
from datetime import datetime
from typing import List
from utils import haversine_km

DRAINAGE_RISK = {"poor": 30, "moderate": 15, "good": 5}
DENSITY_RISK = {"high": 20, "medium": 12, "low": 5}
GRID_RISK = {"overhead-exposed": 20, "overhead-reinforced": 10, "underground": 2}


def _distance_risk(distance_km: float) -> int:
    if distance_km <= 10:
        return 30
    if distance_km <= 25:
        return 22
    if distance_km <= 50:
        return 14
    return 6


def _elevation_risk(elevation_m: float) -> int:
    if elevation_m <= 5:
        return 20
    if elevation_m <= 10:
        return 12
    if elevation_m <= 20:
        return 6
    return 2


def assess_zone(cyclone: dict, zone: dict) -> dict:
    distance_km = haversine_km(
        zone["lat"], zone["lng"], cyclone["landfall_lat"], cyclone["landfall_lng"]
    )

    score = 0
    factors: List[str] = []

    d_risk = _distance_risk(distance_km)
    score += d_risk
    if d_risk >= 22:
        factors.append(f"Only {distance_km:.0f}km from {cyclone['name']}'s predicted landfall")

    e_risk = _elevation_risk(zone["elevation_m"])
    score += e_risk
    if e_risk >= 12:
        factors.append(f"Low elevation ({zone['elevation_m']}m) increases flood/surge exposure")

    dr_risk = DRAINAGE_RISK.get(zone["drainage_capacity"], 15)
    score += dr_risk
    if zone["drainage_capacity"] == "poor":
        factors.append("Poor drainage capacity — high waterlogging risk")

    den_risk = DENSITY_RISK.get(zone["building_density"], 10)
    score += den_risk
    if zone["building_density"] == "high":
        factors.append("High building density increases population exposure")

    grid_risk = GRID_RISK.get(zone["power_grid_exposure"], 10)
    score += grid_risk
    if zone["power_grid_exposure"] == "overhead-exposed":
        factors.append("Overhead exposed power lines vulnerable to high winds")

    if zone.get("past_cyclone_damage"):
        score += 8
        factors.append("History of damage in prior cyclone/flood events")

    wind = cyclone.get("current_wind_speed_kmh", 0)
    if wind >= 150:
        score += 10
    elif wind >= 120:
        score += 6
    elif wind >= 90:
        score += 3

    score = int(min(100, score))

    if score >= 75:
        risk_level = "severe"
    elif score >= 55:
        risk_level = "high"
    elif score >= 35:
        risk_level = "moderate"
    else:
        risk_level = "low"

    reasoning = (
        f"{zone['name']} scores {score}/100, {distance_km:.0f}km from "
        f"{cyclone['name']}'s predicted landfall near {cyclone['landfall_location']}. "
        f"Combined with {zone['drainage_capacity']} drainage and {zone['elevation_m']}m "
        f"elevation, this zone falls in the '{risk_level}' category."
    )

    if risk_level == "severe":
        recommendation = (
            f"Immediate evacuation planning and resource pre-positioning recommended for "
            f"{zone['name']}. Prioritize before landfall."
        )
    elif risk_level == "high":
        recommendation = (
            f"Deploy advance warning and prepare shelters near {zone['name']}. "
            f"Monitor closely as the storm approaches."
        )
    elif risk_level == "moderate":
        recommendation = (
            f"Issue precautionary advisories for {zone['name']}. Prioritize higher-risk "
            f"zones first."
        )
    else:
        recommendation = f"Routine monitoring sufficient for {zone['name']}."

    return {
        "risk_level": risk_level,
        "risk_score": score,
        "distance_from_landfall_km": round(distance_km, 1),
        "key_factors": factors[:4] if factors else ["No major risk factors identified"],
        "reasoning": reasoning,
        "recommendation": recommendation,
        "source": "python-risk-engine",
        "generated_at": datetime.utcnow().isoformat(),
    }