"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useVerticalProducts } from "@/hooks/use-catalog";
import type { Product } from "@/types";

interface ProductsGridProps {
  slug: string;
  locale: string;
}

export function ProductsGrid({ slug, locale }: ProductsGridProps) {
  const { data, isLoading, isError } = useVerticalProducts(slug);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white border border-[#e2e8f0] rounded-xl p-6"
          >
            <div className="h-4 w-32 bg-[#f1f5f9] rounded mb-3 animate-pulse" />
            <div className="h-3 w-full bg-[#f1f5f9] rounded mb-2 animate-pulse" />
            <div className="h-3 w-2/3 bg-[#f1f5f9] rounded mb-4 animate-pulse" />
            <div className="h-4 w-24 bg-[#f1f5f9] rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-[#64748b] py-8">
        {locale === "ja" ? "プランを読み込めませんでした。" : "Products unavailable."}
      </p>
    );
  }

  const products = (data ?? []).filter((p: Product) => p.is_active !== false);

  if (products.length === 0) {
    return (
      <p className="text-center text-[#64748b] py-8">
        {locale === "ja" ? "現在利用可能なプランはありません。" : "No products available."}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {products.map((product: Product) => (
        <Link
          key={product.id}
          href={`/${locale}/category/${slug}/${product.slug}`}
          className="bg-white border border-[#e2e8f0] rounded-xl p-6 hover:border-[#22c55e] hover:shadow-sm transition-all"
        >
          <h3 className="font-semibold text-[#1e293b] mb-1">
            {locale === "ja" ? product.name_ja : product.name_en}
          </h3>
          <p className="text-[#64748b] text-sm mb-3 line-clamp-2">
            {locale === "ja" ? product.description_ja : product.description_en}
          </p>
          <p className="text-[#22c55e] font-medium text-sm mb-3">
            {product.currency === "JPY" ? "¥" : ""}
            {product.base_price.toLocaleString()}
          </p>
          <span className="text-[#22c55e] text-sm font-medium inline-flex items-center gap-1">
            {locale === "ja" ? "詳細を見る" : "View details"}
            <ArrowRight className="h-3 w-3" />
          </span>
        </Link>
      ))}
    </div>
  );
}
