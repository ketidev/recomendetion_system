export interface Customer {
  customer_id: string;
  age: number;
  segment: string;
  income_band: string;
}
export interface Product {
  product_id: string;
  product_name: string;
  category: string;
  [key: string]: string | number;
}
export interface Recommendation {
  product_id: string;
  product_name: string;
  category: string;
  content_score: number;
  collaborative_score: number;
  hybrid_score: number;
}
export interface PopularityItem {
  product_id: string;
  product_name: string;
  category: string;
  interaction_count: number;
  average_rating: number | null;
}
export interface SegmentItem {
  segment: string;
  customer_count: number;
  percentage?: number;
  interaction_count?: number;
  average_rating?: number;
}
