export interface TrackPoint {
  lat: number;
  lng: number;
  timestamp: string;
  wind_speed_kmh: number;
}

export interface Cyclone {
  id: string;
  name: string;
  status: string;
  current_wind_speed_kmh: number;
  landfall_eta: string;
  landfall_location: string;
  landfall_lat: number;
  landfall_lng: number;
  predicted_path: TrackPoint[];
}

export interface Zone {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  elevation_m: number;
  drainage_capacity: "poor" | "moderate" | "good";
  building_density: "low" | "medium" | "high";
  power_grid_exposure: "underground" | "overhead-reinforced" | "overhead-exposed";
  population_estimate: number;
  past_cyclone_damage: string | null;
}

export interface RiskAssessment {
  zone_id: string;
  zone_name: string;
  cyclone_id: string;
  cyclone_name: string;
  risk_level: "low" | "moderate" | "high" | "severe";
  risk_score: number;
  distance_from_landfall_km: number;
  key_factors: string[];
  reasoning: string;
  recommendation: string;
  generated_at: string;
  source: string;
}

export interface DashboardEntry {
  zone_id: string;
  zone_name: string;
  district: string;
  lat: number;
  lng: number;
  risk_level: "low" | "moderate" | "high" | "severe";
  risk_score: number;
  population_estimate: number;
  top_factor: string;
}

export interface DashboardResponse {
  cyclone_id: string;
  cyclone_name: string;
  zones: DashboardEntry[];
}