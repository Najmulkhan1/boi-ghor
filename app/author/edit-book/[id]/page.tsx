"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { BookOpen, Loader2, DollarSign, Image as ImageIcon, FileText, CheckCircle2, UploadCloud } from "lucide-react";

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // ফাইল আপলোডের স্টেট
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME; 
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categories: "",
    coverImage: "",
    pdfUrl: "",
    read_credits: 0,
    download_credits: 0,
    hardCopyAvailable: false,
    hardCopyPrice: 0,
    stockCount: 0,
  });

  // পেজ লোড হলে আগের ডেটা ফেচ করা
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/author/books/${bookId}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            ...data.book,
            categories: data.book.categories?.join(", ") || "", // অ্যারে থেকে স্ট্রিং এ কনভার্ট
          });
        } else {
          alert("বইয়ের ডেটা পাওয়া যায়নি!");
          router.push("/author/my-books");
        }
      } catch (error) {
        console.error("Error fetching book", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [bookId, router]);

  const handleInputChange = (e: any) => {
    const { id, value, type } = e.target;
    const parsedValue = type === "number" ? Number(value) : value;
    setFormData({ ...formData, [id]: parsedValue });
  };

  const handleFileUpload = async (e: any, type: "image" | "raw") => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "image") setUploadingImg(true);
    else setUploadingPdf(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET as string);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
        method: "POST",
        body: data,
      });

      const uploadedData = await res.json();

      if (res.ok) {
        if (type === "image") setFormData({ ...formData, coverImage: uploadedData.secure_url });
        else setFormData({ ...formData, pdfUrl: uploadedData.secure_url });
      } else {
        alert("আপলোড ফেইল হয়েছে!");
      }
    } catch (error) {
      alert("ফাইল আপলোডে সমস্যা হয়েছে।");
    } finally {
      if (type === "image") setUploadingImg(false);
      else setUploadingPdf(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const categoriesArray = formData.categories
        .split(",")
        .map((cat) => cat.trim())
        .filter((cat) => cat.length > 0);

      const payload = { ...formData, categories: categoriesArray };

      const res = await fetch(`/api/author/books/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("বই সফলভাবে আপডেট করা হয়েছে!");
        router.push("/author/my-books"); 
      } else {
        alert("আপডেট করতে কোনো সমস্যা হয়েছে!");
      }
    } catch (error) {
      alert("সার্ভার এরর!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">বই এডিট করুন</h1>
          <p className="text-slate-500 text-sm">আপনার বইয়ের যেকোনো তথ্য পরিবর্তন করে সেভ করুন।</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <Card className="md:col-span-2 shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-slate-400"/> বেসিক ইনফরমেশন</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="title">বইয়ের নাম *</Label>
                <Input id="title" required value={formData.title} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">বইয়ের সারসংক্ষেপ (Description) *</Label>
                <Textarea id="description" required rows={4} value={formData.description} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categories">ক্যাটাগরি (কমা দিয়ে একাধিক লিখতে পারেন)</Label>
                <Input id="categories" value={formData.categories} onChange={handleInputChange} />
              </div>
            </CardContent>
          </Card>

          {/* ফাইল আপলোড সেকশন */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2"><ImageIcon className="w-5 h-5 text-slate-400"/> ফাইল আপডেট করুন (ঐচ্ছিক)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label>কভার ইমেজ পরিবর্তন করুন</Label>
                <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${formData.coverImage ? "border-emerald-400 bg-emerald-50" : "border-slate-300"}`}>
                  {uploadingImg ? (
                    <div className="py-4 text-blue-600 flex flex-col items-center"><Loader2 className="w-8 h-8 animate-spin mb-2" /> আপলোড হচ্ছে...</div>
                  ) : (
                    <div className="flex flex-col items-center text-emerald-600">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formData.coverImage} alt="Cover" className="h-20 mb-3 rounded shadow-sm object-cover" />
                      <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "image")} className="file:bg-blue-50 file:text-blue-700 file:border-0 file:py-1 file:px-3 file:rounded cursor-pointer text-xs" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>পিডিএফ ফাইল পরিবর্তন করুন</Label>
                <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${formData.pdfUrl ? "border-emerald-400 bg-emerald-50" : "border-slate-300"}`}>
                  {uploadingPdf ? (
                    <div className="py-4 text-blue-600 flex flex-col items-center"><Loader2 className="w-8 h-8 animate-spin mb-2" /> আপলোড হচ্ছে...</div>
                  ) : (
                    <div className="flex flex-col items-center text-emerald-600">
                      <CheckCircle2 className="w-8 h-8 mb-2" />
                      <span className="font-semibold text-sm mb-2">পিডিএফ আপলোড করা আছে</span>
                      <Input type="file" accept="application/pdf" onChange={(e) => handleFileUpload(e, "raw")} className="file:bg-blue-50 file:text-blue-700 file:border-0 file:py-1 file:px-3 file:rounded cursor-pointer text-xs" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2"><DollarSign className="w-5 h-5 text-slate-400"/> মূল্য ও ক্রেডিট</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="read_credits">পড়ার জন্য ক্রেডিট</Label>
                  <Input id="read_credits" type="number" min="0" required value={formData.read_credits} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="download_credits">ডাউনলোডের ক্রেডিট</Label>
                  <Input id="download_credits" type="number" min="0" required value={formData.download_credits} onChange={handleInputChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 shadow-sm border-orange-100 bg-orange-50/30">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-orange-900">হার্ডকপি বা ছাপানো বই</CardTitle>
                </div>
                <Switch 
                  id="hardCopyAvailable" 
                  checked={formData.hardCopyAvailable} 
                  onCheckedChange={(c) => setFormData({ ...formData, hardCopyAvailable: c })} 
                />
              </div>
            </CardHeader>
            {formData.hardCopyAvailable && (
              <CardContent className="pt-4 border-t border-orange-200/50 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hardCopyPrice">হার্ডকপির দাম (টাকায়) *</Label>
                  <Input id="hardCopyPrice" type="number" min="1" required={formData.hardCopyAvailable} value={formData.hardCopyPrice} onChange={handleInputChange} className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stockCount">স্টক বা মজুদের পরিমাণ</Label>
                  <Input id="stockCount" type="number" min="0" value={formData.stockCount} onChange={handleInputChange} className="bg-white" />
                </div>
              </CardContent>
            )}
          </Card>

        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/author/my-books")} className="h-12 px-6">বাতিল</Button>
          <Button type="submit" disabled={saving || uploadingImg || uploadingPdf} className="md:w-auto px-8 h-12 text-lg bg-blue-600 hover:bg-blue-700">
            {saving ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> আপডেট হচ্ছে...</> : "পরিবর্তন সেভ করুন"}
          </Button>
        </div>
      </form>
    </div>
  );
}