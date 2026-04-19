import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { QueryProvider } from "@/providers/query-provider";

export const metadata = {
  title: "medipic Admin OS",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#f8fafc] font-sans">
        <QueryProvider>
          <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <AdminHeader />
              <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
