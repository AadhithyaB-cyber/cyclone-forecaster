from pydantic import BaseModel, Field
from typing import List, Optional


class TrackPoint(BaseModel):
    lat: float
    lng: float
    timestamp: str
    wind_speed_kmh: int


class Cyclone(BaseModel):
    id: str
    name: str
    status: str              # "active" | "approaching" | "past"
    current_lat: float
    current_lng: float
    current_wind_speed_kmh: int
    landfall_eta: str
    landfall_location: str
    predicted_path: List[TrackPoint] = Field(default_factory=list)


class Zone(BaseModel):
    id: str
    name: str
    district: str
    lat: float
    lng: float
    elevation_m: float
    distance_from_landfall_km: float
    drainage_capacity: str      # "poor" | "moderate" | "good"
    building_density: str        # "low" | "medium" | "high"
    power_grid_exposure: str      # "underground" | "overhead-reinforced" | "overhead-exposed"
    population_estimate: int
    past_cyclone_damage: Optional[str] = None


class RiskAssessment(BaseModel):
    zone_id: str
    zone_name: str
    risk_level: str          # "low" | "moderate" | "high" | "severe"
    risk_score: int            # 0-100
    key_factors: List[str]
    reasoning: str
    recommendation: str
    generated_at: str
    source: str               # "python-risk-engine"


class DashboardEntry(BaseModel):
    zone_id: str
    zone_name: str
    district: str
    risk_level: str
    risk_score: int
    population_estimate: int
    top_factor: str
