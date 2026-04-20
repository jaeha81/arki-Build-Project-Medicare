"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Pill, Calendar, User, Hash } from "lucide-react"

export interface Prescription {
  id: string
  drug_name: string
  dosage: string
  instructions: string
  issued_at: string
  inkan_number: string | null
  status: "issued" | "dispensed" | "delivered"
  doctor_id: string
}

const STATUS_LABEL: Record<Prescription["status"], { en: string; ja: string; color: string }> = {
  issued: { en: "Issued", ja: "発行済", color: "bg-blue-100 text-blue-700 border-blue-200" },
  dispensed: { en: "Dispensed", ja: "調剤済", color: "bg-amber-100 text-amber-700 border-amber-200" },
  delivered: { en: "Delivered", ja: "配達済", color: "bg-green-100 text-green-700 border-green-200" },
}

interface PrescriptionCardProps {
  prescription: Prescription
  locale?: string
}

export function PrescriptionCard({ prescription, locale = "en" }: PrescriptionCardProps) {
  const isJa = locale === "ja"
  const status = STATUS_LABEL[prescription.status]
  const issuedDate = new Date(prescription.issued_at).toLocaleDateString(
    isJa ? "ja-JP" : "en-US",
    { year: "numeric", month: "short", day: "numeric" }
  )

  return (
    <Card className="border border-[#e2e8f0]">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0">
              <Pill className="h-4 w-4 text-[#22c55e]" />
            </div>
            <div>
              <p className="font-semibold text-[#1e293b] text-sm">{prescription.drug_name}</p>
              <p className="text-xs text-[#64748b]">{prescription.dosage}</p>
            </div>
          </div>
          <Badge className={`text-xs border ${status.color} shrink-0`}>
            {isJa ? status.ja : status.en}
          </Badge>
        </div>

        <p className="text-xs text-[#475569] bg-[#f8fafc] rounded p-2 leading-relaxed">
          {prescription.instructions}
        </p>

        <div className="flex flex-wrap gap-3 text-xs text-[#64748b]">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {issuedDate}
          </span>
          {prescription.inkan_number && (
            <span className="flex items-center gap-1">
              <Hash className="h-3 w-3" />
              {prescription.inkan_number}
            </span>
          )}
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {isJa ? "担当医" : "Physician"} #{prescription.doctor_id.slice(0, 8)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
