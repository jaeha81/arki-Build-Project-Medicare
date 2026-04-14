import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { QueryProvider } from "@/providers/query-provider";
import "../globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Project Medicare — Online Medical Consultation",
  description: "Licensed physicians. Science-backed treatments. Discreet delivery.",
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <body className="antialiased bg-[#fafffe] text-[#1e293b] font-sans flex flex-col min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
