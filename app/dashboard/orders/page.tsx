import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Calendar, MapPin, ExternalLink } from "lucide-react";

// Server Component
export default async function MyOrdersPage() {
  const session = await getServerSession(authOptions);

  // ইউজার লগিন করা না থাকলে লগিন পেজে পাঠিয়ে দেবে
  if (!session) {
    redirect("/auth/login");
  }

  await connectToDatabase();

  // ডাটাবেস থেকে ইউজারের সব অর্ডার লেটেস্ট থেকে পুরনোর ক্রমানুসারে আনা হচ্ছে
  const orders = await Order.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  // স্ট্যাটাস অনুযায়ী ব্যাজের কালার ঠিক করার ফাংশন
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Confirmed</Badge>;
      case "shipped":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Shipped</Badge>;
      case "delivered":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">আমার অর্ডারসমূহ</h1>

      {orders.length === 0 ? (
        <Card className="text-center py-16 border-dashed">
          <CardContent>
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">আপনি এখনো কোনো অর্ডার করেননি</h2>
            <p className="text-gray-500 mb-6">আপনার পছন্দের হার্ডকপি বইগুলো আজই অর্ডার করুন।</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/books">বই ব্রাউজ করুন</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <Card key={order._id.toString()} className="overflow-hidden shadow-sm hover:shadow transition-shadow">
              
              {/* Order Header */}
              <CardHeader className="bg-gray-50 border-b pb-4 pt-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      অর্ডার #{order.orderId}
                      {getStatusBadge(order.status)}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString("bn-BD", { 
                          year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {order.shippingAddress.city}
                      </span>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-gray-500">সর্বমোট (Total)</p>
                    <p className="text-xl font-bold text-blue-700">৳{order.totalAmount}</p>
                  </div>
                </div>
              </CardHeader>

              {/* Order Items */}
              <CardContent className="p-0">
                <div className="divide-y">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-4">
                      <div className="w-12 h-16 bg-gray-100 rounded flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={item.coverImage} 
                          alt={item.title} 
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h4>
                        <p className="text-sm text-gray-500">
                          {item.quantity} কপি x ৳{item.unitPrice}
                        </p>
                      </div>
                      <div className="font-medium text-gray-900">
                        ৳{item.subtotal}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Action Button */}
                <div className="bg-gray-50 p-4 border-t flex justify-end">
                  <Button variant="outline" className="gap-2" asChild>
                    <Link href={`/dashboard/orders/${order.orderId}`}>
                      বিস্তারিত দেখুন <ExternalLink className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>

            </Card>
          ))}
        </div>
      )}
    </div>
  );
}