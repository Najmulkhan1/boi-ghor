import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import AdminSidebar from "@/components/layout/AdminSidebar";
import MobileAdminNav from "@/components/layout/MobileAdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await connectToDatabase();
  const user = await User.findById(session.user.id).select("role").lean();

  if (user?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    // "dark" class forces dark mode across the entire admin panel
    <div className="dark min-h-screen bg-[#0f1117] flex flex-col md:flex-row">
      {/* মোবাইলের জন্য টপ নেভিগেশন */}
      <MobileAdminNav />

      {/* ডেস্কটপ সাইডবার */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50 border-r border-slate-800 bg-[#0f172a] shadow-xl">
        <AdminSidebar />
      </aside>

      {/* মেইন কন্টেন্ট এরিয়া */}
      <main className="flex-1 md:pl-72 min-h-screen bg-[#0f1117] transition-all duration-300">
        <div className="p-4 md:p-10 max-w-7xl mx-auto">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}