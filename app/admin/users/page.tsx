"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Loader2, Shield, User as UserIcon, Coins, Search } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleUpdate = async (userId: string, payload: any) => {
    setUpdating(userId);
    const res = await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...payload }),
    });
    if (res.ok) {
      fetchUsers();
    }
    setUpdating(null);
  };

  // সার্চ ফিল্টার
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Users className="text-indigo-600" /> ইউজার ও রোল ম্যানেজমেন্ট
        </h1>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-bold">ইউজার</th>
              <th className="px-6 py-4 font-bold">রোল (Role)</th>
              <th className="px-6 py-4 font-bold">ক্রেডিট (Credits)</th>
              <th className="px-6 py-4 font-bold text-center">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                      {user.avatar ? (
                         <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                      ) : user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={user.role}
                    onChange={(e) => handleUpdate(user._id, { role: e.target.value, credits: user.credits })}
                    className="text-xs border-slate-200 rounded-md p-1.5 focus:ring-indigo-500 bg-white"
                  >
                    <option value="user">User</option>
                    <option value="author">Author</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <Input 
                      type="number"
                      defaultValue={user.credits}
                      className="w-20 h-8 text-xs font-bold"
                      onBlur={(e) => handleUpdate(user._id, { role: user.role, credits: Number(e.target.value) })}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {updating === user._id ? (
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-600 mx-auto" />
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium italic">অটো-সেভ অন</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="text-center py-10 text-slate-400">কোনো ইউজার পাওয়া যায়নি।</div>
        )}
      </div>
    </div>
  );
}