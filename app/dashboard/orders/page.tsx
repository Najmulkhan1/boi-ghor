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

export default async function MyOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  await connectToDatabase();

  const orders = await Order.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">Confirmed</Badge>;
      case "shipped":
        return <Badge variant="outline" className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">Shipped</Badge>;
      case "delivered":
        return <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">Cancelled</Badge>;
      default:
        return <Badge className="bg-slate-800 text-slate-400 border-slate-700">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
        <div className="bg-amber-500/20 p-3 rounded-xl text-amber-400">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">আমার অর্ডারসমূহ</h1>
          <p className="text-slate-500 text-sm">আপনার হার্ডকপি বইয়ের অর্ডার স্ট্যাটাস জানুন।</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-dashed border-slate-800 rounded-2xl">
          <Package className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">আপনি এখনো কোনো অর্ডার করেননি</h2>
          <p className="text-slate-500 mb-6">আপনার পছন্দের হার্ডকপি বইগুলো আজই অর্ডার করুন।</p>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Link href="/books">বই ব্রাউজ করুন</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order: any) => (
            <div key={order._id.toString()} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors">
              
              {/* Order Header */}
              <div className="bg-slate-800/50 border-b border-slate-800 p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-3">
                      অর্ডার <span className="font-mono text-indigo-400">#{order.orderId}</span>
                      {getStatusBadge(order.status)}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400 mt-2">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        {new Date(order.createdAt).toLocaleDateString("bn-BD", { 
                          year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                      </span>
                      <span className="flex items-center gap-1.5 border-l border-slate-700 pl-4">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        {order.shippingAddress.city}
                      </span>
                    </div>
                  </div>
                  <div className="text-left md:text-right bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">সর্বমোট (Total)</p>
                    <p className="text-xl font-black text-white">৳{order.totalAmount}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-0">
                <div className="divide-y divide-slate-800/50">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-5 hover:bg-slate-800/30 transition-colors">
                      <div className="w-12 h-16 bg-slate-800 rounded-md shrink-0 border border-slate-700/50 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={item.coverImage} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-white line-clamp-1">{item.title}</h4>
                        <p className="text-sm text-slate-500 mt-1">
                          {item.quantity} কপি × ৳{item.unitPrice}
                        </p>
                      </div>
                      <div className="font-bold text-white shrink-0">
                        ৳{item.subtotal}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Action Button */}
                <div className="bg-slate-800/30 p-4 border-t border-slate-800 flex justify-end">
                  <Button variant="outline" className="gap-2 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800" asChild>
                    <Link href={`/dashboard/orders/${order.orderId}`}>
                      বিস্তারিত দেখুন <ExternalLink className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}