export interface Vertical {
  id: string;
  slug: string;
  name_en: string;
  name_ja: string;
  description_en: string;
  description_ja: string;
  icon: string | null;
  is_active: boolean;
}

export interface ProductVariant {
  id: string;
  name_en: string;
  name_ja: string;
  price: number;
  duration_days: number | null;
}

export interface Product {
  id: string;
  slug: string;
  name_en: string;
  name_ja: string;
  description_en: string;
  description_ja: string;
  base_price: number;
  currency: string;
  vertical_id: string;
  variants: ProductVariant[];
}

export interface FAQ {
  id: string;
  vertical_id: string | null;
  question_en: string;
  question_ja: string;
  answer_en: string;
  answer_ja: string;
  sort_order: number;
}
