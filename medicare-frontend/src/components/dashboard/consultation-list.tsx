"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { ConsultationStatus } from "@/types/consultation"

interface ConsultationItem {
  id: string
  status: ConsultationStatus
  vertical_id: string | null
  created_at: string
}

interface ConsultationListProps {
  consultations: ConsultationItem[]
  locale: string
}

const STATUS_LABELS: Record<ConsultationStatus, string> = {
  pending: "Pending",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
}

const STATUS_VARIANTS: Record<
  ConsultationStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  under_review: "default",
  approved: "default",
  rejected: "destructive",
  completed: "outline",
}

export function ConsultationList({ consultations, locale }: ConsultationListProps) {
  if (consultations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="mb-4">No consultations yet</p>
        <Button
          render={<Link href={`/${locale}/consultation`} />}
          className="bg-[#22c55e] hover:bg-[#16a34a] text-white"
        >
          Start Consultation
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {consultations.map((item) => (
        <Card key={item.id} className="border border-[#e2e8f0]">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-[#1e293b]">
                {item.vertical_id ?? "General Consultation"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>
            <Badge variant={STATUS_VARIANTS[item.status]}>
              {STATUS_LABELS[item.status]}
            </Badge>
          </CardContent>
        </Card>
      ))}

      <div className="pt-2">
        <Button
          render={<Link href={`/${locale}/consultation`} />}
          variant="outline"
          className="w-full"
        >
          New Consultation
        </Button>
      </div>
    </div>
  )
}
