import type { Cyclone, Zone, RiskAssessment, DashboardResponse } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function handleRes<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function fetchCyclones(): Promise<Cyclone[]> {
  const res = await fetch(`${API_URL}/cyclones`);
  return handleRes(res);
}

export async function fetchCyclone(id: string): Promise<Cyclone> {
  const res = await fetch(`${API_URL}/cyclones/${id}`);
  return handleRes(res);
}

export async function fetchZones(): Promise<Zone[]> {
  const res = await fetch(`${API_URL}/zones`);
  return handleRes(res);
}

export async function fetchZone(id: string): Promise<Zone> {
  const res = await fetch(`${API_URL}/zones/${id}`);
  return handleRes(res);
}

export async function fetchRiskAssessment(zoneId: string, cycloneId?: string): Promise<RiskAssessment> {
  const url = cycloneId
    ? `${API_URL}/zones/${zoneId}/risk-assessment?cyclone_id=${cycloneId}`
    : `${API_URL}/zones/${zoneId}/risk-assessment`;
  const res = await fetch(url);
  return handleRes(res);
}

export async function fetchDashboard(cycloneId?: string): Promise<DashboardResponse> {
  const url = cycloneId ? `${API_URL}/dashboard?cyclone_id=${cycloneId}` : `${API_URL}/dashboard`;
  const res = await fetch(url);
  return handleRes(res);
}

export function reportDownloadUrl(cycloneId?: string): string {
  return cycloneId ? `${API_URL}/report?cyclone_id=${cycloneId}` : `${API_URL}/report`;
}