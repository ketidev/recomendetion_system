import type {
  Customer,
  PopularityItem,
  Product,
  Recommendation,
  SegmentItem,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || `Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  customers: (limit = 1000) =>
    request<{ count: number; customers: Customer[] }>(
      `/customers/?limit=${limit}`,
    ),
  products: () => request<{ count: number; products: Product[] }>("/products/"),
  recommendations: (customerId: string, topN = 5) =>
    request<{ customer_id: string; recommendations: Recommendation[] }>(
      `/recommendations/${encodeURIComponent(customerId)}?top_n=${topN}`,
    ),
  popularity: () =>
    request<{ count: number; products: PopularityItem[] }>(
      "/analytics/popularity",
    ),
  segments: () =>
    request<{ count: number; segments: SegmentItem[] }>("/analytics/segments"),
  segmentRatings: () =>
    request<{ count: number; segments: SegmentItem[] }>(
      "/analytics/segment-ratings",
    ),
};
