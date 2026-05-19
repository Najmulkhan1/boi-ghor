"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, Loader2, Shield, User as UserIcon, Coins, Search, 
  Edit3, Save, ImageIcon, UploadCloud, CheckCircle2 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  // মোডাল হ্যান্ডলিং এর জন্য স্টেট (User Edit)
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  // 💡 নোটিফিকেশন দেখানোর জন্য স্টেট
  const [toastMsg, setToastMsg] = useState<{ text: string, type: 'info' | 'success' | 'error' } | null>(null);

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // নোটিফিকেশন দেখানোর ফাংশন
  const showToast = (text: string, type: 'info' | 'success' | 'error') => {
    setToastMsg({ text, type });
    // ৩ সেকেন্ড পর নোটিফিকেশন অটোমেটিক চলে যাবে
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  // কুইক আপডেটের জন্য (Role, Credits)
  const handleQuickUpdate = async (userId: string, payload: any) => {
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

  // মোডাল থেকে সম্পূর্ণ ডেটা আপডেটের জন্য (Name, Avatar)
  const handleFullUpdate = async () => {
    if (!selectedUser) return;
    setUpdating("modal_update");

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: selectedUser._id, 
          name: selectedUser.name, 
          avatar: selectedUser.avatar 
        }),
      });

      if (res.ok) {
        fetchUsers();
        setIsModalOpen(false); // মোডাল বন্ধ করা
        showToast("প্রোফাইল সফলভাবে আপডেট হয়েছে!", "success");
      } else {
        alert("আপডেট করতে সমস্যা হয়েছে!");
      }
    } catch (error) {
      alert("সার্ভার এরর!");
    } finally {
      setUpdating(null);
    }
  };

  // 💡 সরাসরি ফাইল ম্যানেজার থেকে ছবি আপলোডের ফাংশন (নোটিফিকেশন সহ)
  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImg(true);
    showToast("ছবি আপলোড শুরু হয়েছে...", "info");

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET as string);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const uploadedData = await res.json();

      if (res.ok) {
        setSelectedUser({ ...selectedUser, avatar: uploadedData.secure_url });
        showToast("ছবি সফলভাবে আপলোড হয়েছে! 🎉", "success");
      } else {
        showToast("আপলোড ফেইল হয়েছে!", "error");
      }
    } catch (error) {
      showToast("ফাইল আপলোডে সমস্যা হয়েছে।", "error");
    } finally {
      setUploadingImg(false);
    }
  };

  // সার্চ ফিল্টার
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(search.toLowerCase()) || 
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600 w-8 h-8" /></div>;

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Users className="text-indigo-600" /> ইউজার ও রোল ম্যানেজমেন্ট
        </h1>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..." 
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
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold overflow-hidden shadow-sm border border-slate-200">
                      {user.avatar ? (
                         <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
                      ) : (
                         <span>{user.name?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 line-clamp-1">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={user.role}
                    onChange={(e) => handleQuickUpdate(user._id, { role: e.target.value })}
                    className="text-xs border-slate-200 rounded-md p-1.5 focus:ring-indigo-500 bg-white font-medium cursor-pointer"
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
                      defaultValue={user.credits || 0}
                      className="w-20 h-8 text-xs font-bold"
                      onBlur={(e) => {
                        const val = Number(e.target.value);
                        if(val !== user.credits) handleQuickUpdate(user._id, { credits: val });
                      }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {updating === user._id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setSelectedUser({ ...user }); setIsModalOpen(true); }}
                        className="gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 h-8"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> এডিট
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="text-center py-10 text-slate-400">কোনো ইউজার পাওয়া যায়নি।</div>
        )}
      </div>

      {/* ======================================================= */}
      {/* USER EDIT MODAL */}
      {/* ======================================================= */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-indigo-600" /> ইউজার প্রোফাইল এডিট
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-5 py-4">
              
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">ইউজারের নাম</Label>
                <Input 
                  value={selectedUser.name} 
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })} 
                  className="h-11 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">ইমেইল (পরিবর্তনযোগ্য নয়)</Label>
                <Input 
                  value={selectedUser.email} 
                  readOnly 
                  className="h-11 rounded-lg bg-slate-50 cursor-not-allowed text-slate-500"
                />
              </div>

              <div className="space-y-2 border-t pt-4">
                <Label className="text-sm font-bold text-indigo-600 flex items-center gap-1">
                  <ImageIcon className="w-4 h-4" /> প্রোফাইল ছবি (Avatar) পরিবর্তন
                </Label>
                <div className="flex items-center gap-4 p-3 border rounded-lg bg-slate-50">
                  <div className="w-14 h-14 rounded-full border-2 border-slate-200 bg-white overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                    {selectedUser.avatar ? (
                      <img src={selectedUser.avatar} className="w-full h-full object-cover" alt="avatar" />
                    ) : (
                      <UserIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    {uploadingImg ? (
                      <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold">
                        <Loader2 className="w-4 h-4 animate-spin" /> আপলোড হচ্ছে...
                      </div>
                    ) : (
                      <div className="relative overflow-hidden inline-block w-full">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="text-indigo-600 border-indigo-200 w-full pointer-events-none"
                        >
                          <UploadCloud className="w-4 h-4 mr-2" /> ছবি আপলোড করুন
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploadingImg}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          <div className="flex justify-end gap-3 border-t pt-4 mt-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>বাতিল</Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 gap-2" 
              onClick={handleFullUpdate} 
              disabled={updating === "modal_update" || uploadingImg}
            >
              {updating === "modal_update" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              সেভ করুন
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 💡 ফ্লোটিং নোটিফিকেশন (Toast) */}
      {toastMsg && (
        <div 
          className={`fixed bottom-6 right-6 px-5 py-3.5 rounded-xl shadow-2xl text-white font-medium z-[100] flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 ${
            toastMsg.type === 'success' ? 'bg-emerald-600' : 
            toastMsg.type === 'error' ? 'bg-rose-600' : 
            'bg-indigo-600'
          }`}
        >
          {toastMsg.type === 'info' && <Loader2 className="w-5 h-5 animate-spin" />}
          {toastMsg.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
          {toastMsg.text}
        </div>
      )}
    </div>
  );
}