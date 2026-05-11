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

  // কেউ লগিন ছাড়া ড্যাশবোর্ডে আসার চেষ্টা করলে লগিন পেজে পাঠিয়ে দেবে
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* বাম দিকের সাইডবার */}
          <div className="w-full md:w-64 flex-shrink-0">
            <DashboardSidebar />
          </div>

          {/* ডান দিকের মূল কন্টেন্ট (যেখানে বিভিন্ন পেজ লোড হবে) */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
            {children}
          </div>
          
        </div>
      </div>
    </div>
  );
}