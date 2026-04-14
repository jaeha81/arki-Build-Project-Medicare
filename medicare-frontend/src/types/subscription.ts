export type SubscriptionStatus =
  | "active"
  | "paused"
  | "cancelled"
  | "expired";

export interface Subscription {
  id: string;
  customer_id: string;
  product_id: string;
  variant_id: string;
  status: SubscriptionStatus;
  next_billing_date: string | null;
  created_at: string;
}
