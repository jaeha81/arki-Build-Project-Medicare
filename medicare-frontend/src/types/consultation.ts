export interface ConsultationCreate {
  vertical_id?: string | null;
  name: string;
  email: string;
  age_range?: string | null;
  preferred_language: "en" | "ja";
  health_survey?: Record<string, unknown> | null;
  product_interest?: Record<string, unknown> | null;
  consent_terms: boolean;
  consent_privacy: boolean;
  consent_medical: boolean;
}

export type ConsultationStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "completed";

export interface ConsultationStatusOut {
  id: string;
  status: ConsultationStatus;
}
