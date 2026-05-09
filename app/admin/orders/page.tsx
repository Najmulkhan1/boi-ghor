import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);

  // অ্যাডমিন ছাড়া অন্য কেউ এই পেজে আসতে পারবে না
  if (!session || (session.user as any).role !== "admin") {
    redirect("/"); 
  }

  await connectToDatabase();

  // ডাটাবেস থেকে সব ইউজারদের অর্ডার আনা হচ্ছে (ইউজারের তথ্যসহ)
  const orders = await Order.find({})
    .populate("userId", "name email") // ইউজারের নাম ও ইমেইল আনার জন্য
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">সব অর্ডার (Admin Panel)</h1>

      <Card>
        <CardHeader>
          <CardTitle>অর্ডার লিস্ট ({orders.length} টি)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Action (Status)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                      এখনো কোনো অর্ডার আসেনি।
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order: any) => (
                    <TableRow key={order._id.toString()}>
                      <TableCell className="font-medium text-blue-600">
                        #{order.orderId}
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold">{order.shippingAddress.fullName}</p>
                        <p className="text-xs text-gray-500">{order.shippingAddress.phone}</p>
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                      </TableCell>
                      <TableCell className="font-bold">
                        ৳{order.totalAmount}
                      </TableCell>
                      <TableCell className="uppercase text-xs font-semibold text-gray-600">
                        {order.payment.method}
                      </TableCell>
                      <TableCell>
                        {/* স্ট্যাটাস আপডেট করার ড্রপডাউন */}
                        <OrderStatusSelect 
                          orderId={order._id.toString()} 
                          currentStatus={order.status} 
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}