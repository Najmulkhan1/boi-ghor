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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 flex flex-col md:flex-row">
      {/* মোবাইলের জন্য টপ নেভিগেশন (Logo + Menu Button) */}
      <MobileAdminNav />

      {/* ডেস্কটপ সাইডবার (Sticky & Hidden on Mobile) */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <AdminSidebar />
      </aside>

      {/* মেইন কন্টেন্ট এরিয়া */}
      <main className="flex-1 md:pl-72 min-h-screen transition-all duration-300">
        <div className="p-4 md:p-10 max-w-7xl mx-auto">
          {/* Page Wrapper for clean spacing */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
} 