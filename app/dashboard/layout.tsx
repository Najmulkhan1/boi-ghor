import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    // "dark" class forces dark theme throughout the dashboard
    <div className="dark min-h-screen bg-[#0f1117] py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-6">

          {/* বাম দিকের সাইডবার */}
          <div className="w-full md:w-64 flex-shrink-0">
            <DashboardSidebar />
          </div>

          {/* ডান দিকের মূল কন্টেন্ট */}
          <div className="flex-1 bg-[#161b27] rounded-2xl border border-slate-800 p-6 md:p-8 min-h-[500px]">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}