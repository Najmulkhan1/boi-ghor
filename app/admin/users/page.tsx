import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdjustCreditDialog from "@/components/admin/AdjustCreditDialog";
import { Badge } from "@/components/ui/badge";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "admin") {
    redirect("/");
  }

  await connectToDatabase();

  // সব ইউজারের তালিকা ডাটাবেস থেকে আনা হচ্ছে
  const users = await User.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">ইউজার ম্যানেজমেন্ট (Admin)</h1>

      <Card>
        <CardHeader>
          <CardTitle>সব ইউজার ({users.length} জন)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>নাম ও ইমেইল</TableHead>
                  <TableHead>রোল (Role)</TableHead>
                  <TableHead>ক্রেডিট ব্যালেন্স</TableHead>
                  <TableHead>অ্যাকাউন্ট তৈরি</TableHead>
                  <TableHead>অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any) => (
                  <TableRow key={user._id.toString()}>
                    <TableCell>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </TableCell>
                    <TableCell>
                      {user.role === "admin" ? (
                        <Badge className="bg-purple-600 hover:bg-purple-700">Admin</Badge>
                      ) : (
                        <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-extrabold text-blue-700 text-lg">{user.credits || 0}</span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("bn-BD")}
                    </TableCell>
                    <TableCell>
                      {/* ক্রেডিট অ্যাডজাস্ট করার মডাল কম্পোনেন্ট */}
                      <AdjustCreditDialog 
                        userId={user._id.toString()} 
                        userName={user.name} 
                        currentCredits={user.credits || 0} 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}