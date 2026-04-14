export interface Review {
  id: string;
  product_id: string;
  customer_id: string;
  rating: number;
  body: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface ReviewCreate {
  product_id: string;
  rating: number;
  body?: string;
}
