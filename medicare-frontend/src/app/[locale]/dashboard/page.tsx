"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { LogOut, Pill } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConsultationList } from "@/components/dashboard/consultation-list"
import { SubscriptionCard } from "@/components/dashboard/subscription-card"
import { useAuthStore } from "@/stores/auth-store"
import { useLogout } from "@/hooks/use-auth"
import type { ConsultationStatus } from "@/types/consultation"
import type { Subscription } from "@/types/subscription"

interface ConsultationItem {
  id: string
  status: ConsultationStatus
  vertical_id: string | null
  created_at: string
}

async function fetchWithCookie<T>(path: string): Promise<T> {
  const res = await fetch(path, { credentials: "same-origin" })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText })) as { message?: string }
    throw new Error(err.message ?? "Request failed")
  }
  return res.json() as Promise<T>
}

export default function DashboardPage() {
  const params = useParams()
  const router = useRouter()
  const locale = typeof params.locale === "string" ? params.locale : "en"
  const { user } = useAuthStore()
  const logout = useLogout(locale)

  useEffect(() => {
    if (!user) {
      router.push(`/${locale}/auth/login`)
    }
  }, [user, locale, router])

  const consultationsQuery = useQuery({
    queryKey: ["customer-consultations"],
    queryFn: () =>
      fetchWithCookie<ConsultationItem[]>("/api/proxy/customer/consultations"),
    enabled: !!user,
  })

  const subscriptionsQuery = useQuery({
    queryKey: ["customer-subscriptions"],
    queryFn: () =>
      fetchWithCookie<Subscription[]>("/api/proxy/customer/subscriptions"),
    enabled: !!user,
  })

  if (!user) {
    return null
  }

  const consultations = consultationsQuery.data ?? []
  const subscriptions = subscriptionsQuery.data ?? []
  const activeSubscription = subscriptions.find((s) => s.status === "active") ?? null

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-[#14685a]">medipic</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-muted-foreground"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">My Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user.fullName ?? user.email}
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Consultations */}
          <Card className="border border-[#e2e8f0]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-[#1e293b]">
                {locale === "ja" ? "相談一覧" : "My Consultations"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {consultationsQuery.isLoading ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {locale === "ja" ? "読み込み中..." : "Loading..."}
                </p>
              ) : (
                <ConsultationList consultations={consultations} locale={locale} />
              )}
            </CardContent>
          </Card>

          {/* Subscriptions */}
          <Card className="border border-[#e2e8f0]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-[#1e293b]">
                {locale === "ja" ? "サブスクリプション" : "My Subscriptions"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subscriptionsQuery.isLoading ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {locale === "ja" ? "読み込み中..." : "Loading..."}
                </p>
              ) : (
                <SubscriptionCard
                  subscription={activeSubscription}
                  locale={locale}
                />
              )}
            </CardContent>
          </Card>

          {/* Prescriptions shortcut */}
          <Link href={`/${locale}/dashboard/prescriptions`} className="md:col-span-2">
            <Card className="border border-[#e2e8f0] hover:border-[#22c55e] transition-colors cursor-pointer group">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#f0fdf4] flex items-center justify-center group-hover:bg-[#dcfce7] transition-colors">
                    <Pill className="h-5 w-5 text-[#22c55e]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1e293b] text-sm">
                      {locale === "ja" ? "処方履歴" : "My Prescriptions"}
                    </p>
                    <p className="text-xs text-[#64748b]">
                      {locale === "ja" ? "医師から発行された処方箋を確認する" : "View prescriptions issued by your physician"}
                    </p>
                  </div>
                </div>
                <span className="text-[#94a3b8] text-sm group-hover:text-[#22c55e] transition-colors">→</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
