"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useLogin } from "@/hooks/use-auth"
import { LineLoginButton } from "@/components/auth/LineLoginButton"

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const params = useParams()
  const locale = typeof params.locale === "string" ? params.locale : "en"
  const login = useLogin(locale)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormValues) => {
    login.mutate(data)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <Card className="w-full max-w-sm shadow-sm">
        <CardHeader className="text-center">
          <div className="flex items-center gap-2 justify-center mb-2">
            <span className="font-bold text-xl tracking-tight text-[#14685a]">medipic</span>
          </div>
          <CardTitle className="text-xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password.message}</p>
              )}
            </div>

            {login.error && (
              <p className="text-red-500 text-sm">
                {login.error instanceof Error
                  ? login.error.message
                  : "Login failed. Please try again."}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || login.isPending}
              className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white"
            >
              {login.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>

        <CardContent className="pt-0">
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#e2e8f0]" />
            </div>
            <div className="relative flex justify-center text-xs text-muted-foreground">
              <span className="bg-white px-2">or</span>
            </div>
          </div>
          <LineLoginButton locale={locale} />
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href={`/${locale}/auth/register`}
              className="text-[#22c55e] hover:underline font-medium"
            >
              Create Account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
