"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { LogOut, Pill } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PrescriptionCard, type Prescription } from "@/components/prescription/PrescriptionCard"
import { useAuthStore } from "@/stores/auth-store"
import { useLogout } from "@/hooks/use-auth"

async function fetchWithCookie<T>(path: string): Promise<T> {
  const res = await fetch(path, { credentials: "same-origin" })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText })) as { message?: string }
    throw new Error(err.message ?? "Request failed")
  }
  return res.json() as Promise<T>
}

export default function PrescriptionsPage() {
  const params = useParams()
  const router = useRouter()
  const locale = typeof params.locale === "string" ? params.locale : "en"
  const isJa = locale === "ja"
  const { user } = useAuthStore()
  const logout = useLogout(locale)

  useEffect(() => {
    if (!user) {
      router.push(`/${locale}/auth/login`)
    }
  }, [user, locale, router])

  const prescriptionsQuery = useQuery({
    queryKey: ["customer-prescriptions"],
    queryFn: () => fetchWithCookie<Prescription[]>("/api/proxy/customer/prescriptions"),
    enabled: !!user,
  })

  if (!user) return null

  const prescriptions = prescriptionsQuery.data ?? []

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white border-b border-[#e2e8f0] px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/dashboard`} className="font-bold text-lg tracking-tight text-[#14685a]">
              medipic
            </Link>
            <span className="text-[#e2e8f0]">|</span>
            <span className="text-sm text-[#64748b] font-medium">
              {isJa ? "処方履歴" : "Prescriptions"}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground">
            <LogOut className="h-4 w-4 mr-1" />
            {isJa ? "ログアウト" : "Sign Out"}
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">
              {isJa ? "処方履歴" : "My Prescriptions"}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {isJa ? "医師から発行された処方箋の一覧です。" : "Prescriptions issued by your physician."}
            </p>
          </div>
          <Link href={`/${locale}/dashboard`}>
            <Button variant="outline" size="sm">
              {isJa ? "ダッシュボードへ" : "Back to Dashboard"}
            </Button>
          </Link>
        </div>

        <Card className="border border-[#e2e8f0]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#1e293b] flex items-center gap-2">
              <Pill className="h-4 w-4 text-[#22c55e]" />
              {isJa ? "処方箋" : "Prescription History"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {prescriptionsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {isJa ? "読み込み中..." : "Loading..."}
              </p>
            ) : prescriptions.length === 0 ? (
              <div className="text-center py-10">
                <Pill className="h-10 w-10 mx-auto mb-3 text-[#cbd5e1]" />
                <p className="text-sm text-[#64748b]">
                  {isJa ? "処方箋はまだありません。" : "No prescriptions yet."}
                </p>
                <p className="text-xs text-[#94a3b8] mt-1">
                  {isJa
                    ? "相談が完了すると医師が処方箋を発行します。"
                    : "A physician will issue a prescription after your consultation is reviewed."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {prescriptions.map((p) => (
                  <PrescriptionCard key={p.id} prescription={p} locale={locale} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
