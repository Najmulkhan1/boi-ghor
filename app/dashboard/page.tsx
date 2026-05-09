import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import UserBook from "@/models/UserBook";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ShoppingBag, BookOpen, ArrowRight } from "lucide-react";

export default async function DashboardHomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  await connectToDatabase();

  // ডাটাবেস থেকে ইউজারের সব তথ্য একসাথে আনা হচ্ছে
  const [user, totalOrders, totalDigitalBooks] = await Promise.all([
    User.findById(session.user.id).lean(),
    Order.countDocuments({ userId: session.user.id }),
    UserBook.countDocuments({ userId: session.user.id, canRead: true }),
  ]);

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">স্বাগতম, {user.name}! 👋</h1>
        <p className="text-gray-600 mt-2">আপনার ড্যাশবোর্ড থেকে বই পড়া, অর্ডার ট্র্যাকিং এবং ক্রেডিট ম্যানেজ করুন।</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Credit Wallet Card */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-blue-50">আমার ক্রেডিট</CardTitle>
            <Wallet className="h-5 w-5 text-blue-100" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold">{user.credits}</div>
            <p className="text-blue-100 text-sm mt-1">ডিজিটাল বই পড়ার জন্য ব্যবহারযোগ্য</p>
          </CardContent>
        </Card>

        {/* Digital Library Card */}
        <Card className="shadow-sm border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">ডিজিটাল লাইব্রেরি</CardTitle>
            <BookOpen className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-gray-900">{totalDigitalBooks}</div>
            <p className="text-gray-500 text-sm mt-1">আনলক করা মোট বইয়ের সংখ্যা</p>
          </CardContent>
        </Card>

        {/* Total Orders Card */}
        <Card className="shadow-sm border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">হার্ডকপি অর্ডার</CardTitle>
            <ShoppingBag className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-gray-900">{totalOrders}</div>
            <p className="text-gray-500 text-sm mt-1">আপনার করা মোট অর্ডারের সংখ্যা</p>
          </CardContent>
        </Card>

      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">বই পড়া চালিয়ে যান</h3>
              <p className="text-gray-500 text-sm">আপনার লাইব্রেরিতে থাকা ডিজিটাল বইগুলো পড়ুন</p>
            </div>
            <Button variant="outline" className="gap-2" asChild>
              <Link href="/dashboard/library">লাইব্রেরি দেখুন <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">অর্ডার ট্র্যাক করুন</h3>
              <p className="text-gray-500 text-sm">আপনার হার্ডকপি বইয়ের ডেলিভারি স্ট্যাটাস জানুন</p>
            </div>
            <Button variant="outline" className="gap-2" asChild>
              <Link href="/dashboard/orders">অর্ডার দেখুন <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}