"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Subscription, SubscriptionStatus } from "@/types/subscription"

interface SubscriptionCardProps {
  subscription: Subscription | null
  locale: string
}

const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  active: "Active",
  paused: "Paused",
  cancelled: "Cancelled",
  expired: "Expired",
}

const STATUS_VARIANTS: Record<
  SubscriptionStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  paused: "secondary",
  cancelled: "destructive",
  expired: "outline",
}

export function SubscriptionCard({ subscription, locale }: SubscriptionCardProps) {
  if (!subscription) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="mb-4">No active subscriptions</p>
        <Button
          render={<Link href={`/${locale}/how-it-works`} />}
          className="bg-[#22c55e] hover:bg-[#16a34a] text-white"
        >
          View Plans
        </Button>
      </div>
    )
  }

  return (
    <Card className="border border-[#e2e8f0]">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-[#1e293b]">
            Plan: {subscription.product_id}
          </p>
          <Badge variant={STATUS_VARIANTS[subscription.status]}>
            {STATUS_LABELS[subscription.status]}
          </Badge>
        </div>
        {subscription.next_billing_date && (
          <p className="text-xs text-muted-foreground">
            Next billing:{" "}
            {new Date(subscription.next_billing_date).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
