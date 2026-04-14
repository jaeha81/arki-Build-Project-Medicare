"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Leaf, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConsultationList } from "@/components/dashboard/consultation-list"
import { SubscriptionCard } from "@/components/dashboard/subscription-card"
import { useAuthStore } from "@/stores/auth-store"
import { apiClient } from "@/lib/api-client"
import { useLogout } from "@/hooks/use-auth"
import type { ConsultationStatus } from "@/types/consultation"
import type { Subscription } from "@/types/subscription"

interface ConsultationItem {
  id: string
  status: ConsultationStatus
  vertical_id: string | null
  created_at: string
}

export default function DashboardPage() {
  const params = useParams()
  const router = useRouter()
  const locale = typeof params.locale === "string" ? params.locale : "en"
  const { user, accessToken } = useAuthStore()
  const logout = useLogout(locale)

  useEffect(() => {
    if (!user || !accessToken) {
      router.push(`/${locale}/auth/login`)
    }
  }, [user, accessToken, locale, router])

  const consultationsQuery = useQuery({
    queryKey: ["customer-consultations", accessToken],
    queryFn: () =>
      apiClient.authGet<ConsultationItem[]>(
        "/api/v1/customer/consultations",
        accessToken!
      ),
    enabled: !!accessToken,
  })

  const subscriptionsQuery = useQuery({
    queryKey: ["customer-subscriptions", accessToken],
    queryFn: () =>
      apiClient.authGet<Subscription[]>(
        "/api/v1/customer/subscriptions",
        accessToken!
      ),
    enabled: !!accessToken,
  })

  if (!user || !accessToken) {
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
            <Leaf className="h-5 w-5 text-[#22c55e]" />
            <span className="font-bold text-[#1e293b]">Medicare</span>
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
                My Consultations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {consultationsQuery.isLoading ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Loading...
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
                My Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subscriptionsQuery.isLoading ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Loading...
                </p>
              ) : (
                <SubscriptionCard
                  subscription={activeSubscription}
                  locale={locale}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
