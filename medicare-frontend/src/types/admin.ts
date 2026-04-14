export type AdminRole = "superadmin" | "reviewer" | "operator";

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
}

export interface AdminApproval {
  id: string;
  agent_id: string;
  action: string;
  details: Record<string, unknown>;
  status: "pending" | "approved" | "rejected";
  reviewed_by: string | null;
  review_note: string | null;
  created_at: string;
}
