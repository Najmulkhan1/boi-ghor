"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { BookPlus, Loader2, UploadCloud, DollarSign, Image as ImageIcon, FileText, CheckCircle2 } from "lucide-react";

export default function AddBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // ফাইল আপলোডের লোডিং এবং সাইজ স্টেট
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [imgSize, setImgSize] = useState<string | null>(null);
  const [pdfSize, setPdfSize] = useState<string | null>(null);

  // Cloudinary ক্রেডেনশিয়াল (.env থেকে আসছে)
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

  const handleInputChange = (e: any) => {
    const { id, value, type } = e.target;
    const parsedValue = type === "number" ? Number(value) : value;
    setFormData({ ...formData, [id]: parsedValue });
  };

  // ফাইলের সাইজ (Bytes) থেকে KB/MB তে কনভার্ট করার ফাংশন
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Cloudinary আপলোড ফাংশন
  const handleFileUpload = async (e: any, type: "image" | "raw") => {
    const file = e.target.files[0];
    if (!file) return;

    // ফাইলের সাইজ কনভার্ট করে সেভ করা
    const fileSizeFormatted = formatBytes(file.size);

    if (type === "image") {
      setUploadingImg(true);
      setImgSize(fileSizeFormatted);
    } else {
      setUploadingPdf(true);
      setPdfSize(fileSizeFormatted);
    }

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
        if (type === "image") {
          setFormData({ ...formData, coverImage: uploadedData.secure_url });
        } else {
          setFormData({ ...formData, pdfUrl: uploadedData.secure_url });
        }
      } else {
        alert("আপলোড ফেইল হয়েছে: " + uploadedData.error.message);
        // ফেইল হলে সাইজ রিমুভ করে দেওয়া
        if (type === "image") setImgSize(null);
        else setPdfSize(null);
      }
    } catch (error) {
      alert("ফাইল আপলোডে সমস্যা হয়েছে। ইন্টারনেট চেক করুন।");
      if (type === "image") setImgSize(null);
      else setPdfSize(null);
    } finally {
      if (type === "image") setUploadingImg(false);
      else setUploadingPdf(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.coverImage || !formData.pdfUrl) {
      return alert("অনুগ্রহ করে কভার ইমেজ এবং পিডিএফ ফাইল আপলোড করুন!");
    }

    setLoading(true);

    try {
      const categoriesArray = formData.categories
        .split(",")
        .map((cat) => cat.trim())
        .filter((cat) => cat.length > 0);

      const payload = { ...formData, categories: categoriesArray };

      const res = await fetch("/api/author/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("বই সফলভাবে যুক্ত করা হয়েছে!");
        router.push("/author/my-books"); 
      } else {
        const data = await res.json();
        alert(data.message || "কোনো সমস্যা হয়েছে!");
      }
    } catch (error) {
      alert("সার্ভার এরর!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
          <BookPlus className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">নতুন বই যুক্ত করুন</h1>
          <p className="text-slate-500 text-sm">আপনার লেখা বইয়ের বিস্তারিত তথ্য ও ফাইল আপলোড করে পাবলিশ করুন।</p>
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
                <Input id="title" required placeholder="যেমন: React For Beginners" value={formData.title} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">বইয়ের সারসংক্ষেপ (Description) *</Label>
                <Textarea id="description" required rows={4} placeholder="বইটিতে কী নিয়ে আলোচনা করা হয়েছে..." value={formData.description} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categories">ক্যাটাগরি (কমা দিয়ে একাধিক লিখতে পারেন)</Label>
                <Input id="categories" placeholder="যেমন: Programming, Web Development" value={formData.categories} onChange={handleInputChange} />
              </div>
            </CardContent>
          </Card>

          {/* ফাইল আপলোড সেকশন */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2"><ImageIcon className="w-5 h-5 text-slate-400"/> ফাইল আপলোড</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              
              {/* কভার ইমেজ আপলোড */}
              <div className="space-y-2">
                <Label>কভার ইমেজ (JPG/PNG) *</Label>
                <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${formData.coverImage ? "border-emerald-400 bg-emerald-50" : "border-slate-300 hover:border-blue-400"}`}>
                  {uploadingImg ? (
                    <div className="py-4 text-blue-600 flex flex-col items-center">
                      <Loader2 className="w-8 h-8 animate-spin mb-2" /> 
                      <span className="font-medium">আপলোড হচ্ছে...</span>
                      {imgSize && <span className="text-xs text-blue-400 mt-1">({imgSize})</span>}
                    </div>
                  ) : formData.coverImage ? (
                    <div className="flex flex-col items-center text-emerald-600">
                      <CheckCircle2 className="w-8 h-8 mb-2" />
                      <span className="font-semibold text-sm">ইমেজ আপলোড সম্পন্ন হয়েছে!</span>
                      {imgSize && <span className="text-xs font-medium text-emerald-700 bg-emerald-200/50 px-2 py-0.5 rounded-full mt-2">ফাইল সাইজ: {imgSize}</span>}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formData.coverImage} alt="Cover" className="h-20 mt-3 rounded shadow-sm object-cover" />
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                      <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "image")} className="file:bg-blue-50 file:text-blue-700 file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-full cursor-pointer" />
                    </>
                  )}
                </div>
              </div>

              {/* পিডিএফ আপলোড */}
              <div className="space-y-2">
                <Label>বইয়ের পিডিএফ (PDF) *</Label>
                <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${formData.pdfUrl ? "border-emerald-400 bg-emerald-50" : "border-slate-300 hover:border-blue-400"}`}>
                  {uploadingPdf ? (
                    <div className="py-4 text-blue-600 flex flex-col items-center">
                      <Loader2 className="w-8 h-8 animate-spin mb-2" /> 
                      <span className="font-medium">আপলোড হচ্ছে (সময় লাগতে পারে)...</span>
                      {pdfSize && <span className="text-xs text-blue-400 mt-1">({pdfSize})</span>}
                    </div>
                  ) : formData.pdfUrl ? (
                    <div className="flex flex-col items-center text-emerald-600">
                      <CheckCircle2 className="w-8 h-8 mb-2" />
                      <span className="font-semibold text-sm">পিডিএফ আপলোড সম্পন্ন হয়েছে!</span>
                      {pdfSize && <span className="text-xs font-medium text-emerald-700 bg-emerald-200/50 px-2 py-0.5 rounded-full mt-2">ফাইল সাইজ: {pdfSize}</span>}
                    </div>
                  ) : (
                    <>
                      <FileText className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                      <Input type="file" accept="application/pdf" onChange={(e) => handleFileUpload(e, "raw")} className="file:bg-blue-50 file:text-blue-700 file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-full cursor-pointer" />
                    </>
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
              <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded">নোট: ফ্রি বইয়ের ক্ষেত্রে ক্রেডিট 0 রাখুন।</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 shadow-sm border-orange-100 bg-orange-50/30">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-orange-900">হার্ডকপি বা ছাপানো বই</CardTitle>
                  <p className="text-sm text-orange-700/70">ব্যবহারকারীরা কি এই বইয়ের ফিজিক্যাল কপি অর্ডার করতে পারবে?</p>
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

        <div className="mt-8 flex justify-end">
          <Button type="submit" disabled={loading || uploadingImg || uploadingPdf} className="w-full md:w-auto px-8 h-12 text-lg bg-blue-600 hover:bg-blue-700">
            {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> আপলোড হচ্ছে...</> : "বই পাবলিশ করুন"}
          </Button>
        </div>
      </form>
    </div>
  );
}