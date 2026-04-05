import { CommuteClass, FurnishedStatus, PetPolicy, ShortlistState, VerificationStatus } from './enums';

export type Listing = {
  id: string;
  canonical_key: string;
  canonical_url: string;
  title: string | null;
  neighborhood: string | null;
  market: string | null;
  lat: number | null;
  lng: number | null;
  entire_place: boolean | null;
  furnished_status: FurnishedStatus;
  kitchen: boolean | null;
  bedrooms: number | null;
  bathrooms: number | null;
  pet_policy: PetPolicy;
  monthly_rent: number | null;
  cleaning_fee: number | null;
  service_fee: number | null;
  broker_fee: number | null;
  deposit: number | null;
  min_stay_days: number | null;
  available_from: string | null;
  available_to: string | null;
  source_ids: string[];
  source_urls: string[];
  verification_status: VerificationStatus;
  last_verified_at: string | null;
  duplicate_cluster_id: string | null;
  score: number | null;
  confidence: number | null;
  risks: string[];
};

export type SearchConstraints = {
  move_in_from: string;
  move_in_to: string;
  min_stay_days: number;
  max_budget: number;
  pet_required: boolean;
  target_areas: string[];
  max_commute_minutes: number;
};

export type SearchResult = {
  score: number;
  confidence: number;
  why_selected: string[];
  risks: string[];
  last_verified_at: string | null;
  sources: { id: string; url: string }[];
  commute_summary: {
    low_minutes: number | null;
    high_minutes: number | null;
    classification: CommuteClass | null;
  };
  effective_cost: number | null;
  listing: Listing;
};

export type ShortlistRecord = {
  id: string;
  listing_id: string;
  state: ShortlistState;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
