import AuthorSidebar from "@/components/layout/AuthorSidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export default async function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // লগিন করা না থাকলে লগিন পেজে পাঠাবে
  if (!session) {
    redirect("/auth/login");
  }

  await connectToDatabase();
  const user = await User.findById(session.user.id).select("role").lean();

  // যদি ইউজারের রোল author বা admin না হয়, তবে তাকে সাধারণ ড্যাশবোর্ডে পাঠিয়ে দেবে
  if (user?.role !== "author" && user?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* বাম দিকের ডার্ক থিম সাইডবার */}
      <div className="w-full md:w-64 flex-shrink-0 z-10 md:sticky md:top-[80px] md:h-[calc(100vh-80px)]">
        <AuthorSidebar />
      </div>

      {/* ডান দিকের মূল কন্টেন্ট */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}