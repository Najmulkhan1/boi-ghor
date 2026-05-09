"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CloudUpload, FileText, Loader2, BookOpen, CheckCircle2, ImageIcon, UploadCloud } from "lucide-react";

export default function AddBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "", slug: "", description: "", authorName: "",
    language: "Bengali", categories: "", 
    read_credits: 0, download_credits: 0,
    hardCopyAvailable: false, hardCopyPrice: 0, hardCopyStock: 0
  });

  const [coverImage, setCoverImage] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const handleChange = (e: any) => {
    const { id, value, type } = e.target;
    setFormData((prev) => ({ ...prev, [id]: type === "number" ? Number(value) : value }));
  };

  const handleTitleChange = (e: any) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    setFormData(prev => ({ ...prev, title, slug }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, hardCopyAvailable: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!coverImage) return alert("অনুগ্রহ করে বইয়ের কভার ছবি আপলোড করুন!");
    if (!formData.hardCopyAvailable && !pdfUrl) return alert("ডিজিটাল বইয়ের জন্য PDF আপলোড করা বাধ্যতামূলক!");

    setLoading(true);

    try {
      const categoriesArray = formData.categories.split(",").map(c => c.trim()).filter(Boolean);
      const payload = { ...formData, categories: categoriesArray, coverImage, pdfUrl };

      

      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("বই সফলভাবে যুক্ত হয়েছে! 🎉");
        router.push("/books");
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("সার্ভার এরর! দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-16 pt-8">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              নতুন বই পাবলিশ করুন
            </h1>
            <p className="text-zinc-500 mt-1.5 text-sm">
              আপনার লাইব্রেরিতে নতুন বই যোগ করতে নিচের ফর্মটি সঠিকভাবে পূরণ করুন।
            </p>
          </div>
          <Button 
            onClick={handleSubmit} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 h-11 text-sm font-medium transition-all shadow-sm"
            disabled={loading}
          >
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> সেভ হচ্ছে...</> : "পাবলিশ করুন"}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column (Left) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* General Info Card */}
            <Card className="border-zinc-200 shadow-sm rounded-xl overflow-hidden bg-white">
              <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 pb-4">
                <CardTitle className="text-lg text-zinc-800">সাধারণ তথ্য</CardTitle>
                <CardDescription>বইয়ের মূল তথ্যগুলো এখানে দিন</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-zinc-700 font-medium">বইয়ের নাম <span className="text-red-500">*</span></Label>
                  <Input id="title" required placeholder="যেমন: পথের পাঁচালী" value={formData.title} onChange={handleTitleChange} className="h-11 rounded-lg border-zinc-200 focus-visible:ring-indigo-500" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="authorName" className="text-zinc-700 font-medium">লেখকের নাম <span className="text-red-500">*</span></Label>
                    <Input id="authorName" required placeholder="লেখকের নাম লিখুন" value={formData.authorName} onChange={handleChange} className="h-11 rounded-lg border-zinc-200 focus-visible:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-zinc-700 font-medium">ইউআরএল (Slug) <span className="text-red-500">*</span></Label>
                    <Input id="slug" required placeholder="pother-pachali" value={formData.slug} onChange={handleChange} className="h-11 bg-zinc-50 border-zinc-200 text-zinc-500 rounded-lg cursor-not-allowed" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categories" className="text-zinc-700 font-medium">ক্যাটাগরি <span className="text-red-500">*</span></Label>
                    <Input id="categories" required placeholder="উপন্যাস, থ্রিলার (কমা দিয়ে)" value={formData.categories} onChange={handleChange} className="h-11 rounded-lg border-zinc-200 focus-visible:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-zinc-700 font-medium">ভাষা</Label>
                    <Input id="language" value={formData.language} onChange={handleChange} className="h-11 rounded-lg border-zinc-200 focus-visible:ring-indigo-500" />
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <Label htmlFor="description" className="text-zinc-700 font-medium">বইয়ের সারাংশ <span className="text-red-500">*</span></Label>
                  <Textarea id="description" required placeholder="বইটির সংক্ষিপ্ত কাহিনী বা বিবরণ লিখুন..." className="h-32 resize-none rounded-lg border-zinc-200 focus-visible:ring-indigo-500 leading-relaxed" value={formData.description} onChange={handleChange} />
                </div>
              </CardContent>
            </Card>

            {/* Media Upload Card */}
            <Card className="border-zinc-200 shadow-sm rounded-xl overflow-hidden bg-white">
              <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 pb-4">
                <CardTitle className="text-lg text-zinc-800">মিডিয়া ও ফাইল</CardTitle>
                <CardDescription>বইয়ের কভার ছবি এবং পিডিএফ ভার্সন আপলোড করুন</CardDescription>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Cover Image Dropzone */}
                <div className="space-y-3">
                  <Label className="text-zinc-700 font-medium">কভার ছবি (Cover Image) <span className="text-red-500">*</span></Label>
                  <CldUploadWidget 
                    uploadPreset="boighor_uploads" 
                    options={{ maxFiles: 1, resourceType: "image" }}
                    onSuccess={(result: any) => setCoverImage(result.info.secure_url)}
                  >
                    {({ open }) => (
                      <div 
                        onClick={() => open()} 
                        className={`relative overflow-hidden flex flex-col items-center justify-center h-56 border-2 border-dashed rounded-xl cursor-pointer transition-all ${coverImage ? 'border-indigo-500' : 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100'}`}
                      >
                        {coverImage ? (
                          <>
                            <img src={coverImage} alt="Cover Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 hover:opacity-40 transition-opacity" />
                            <div className="relative z-10 flex flex-col items-center p-3 bg-white/90 rounded-lg shadow-sm backdrop-blur-sm">
                              <CheckCircle2 className="w-6 h-6 text-indigo-600 mb-1" />
                              <span className="text-xs font-semibold text-zinc-800">পরিবর্তন করুন</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-zinc-100 flex items-center justify-center mb-3 text-zinc-400">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                            <p className="font-medium text-sm text-zinc-700">ছবি আপলোড করুন</p>
                            <p className="text-[11px] text-zinc-500 mt-1">JPG, PNG (Max 2MB)</p>
                          </>
                        )}
                      </div>
                    )}
                  </CldUploadWidget>
                </div>

                {/* PDF Dropzone */}
                <div className="space-y-3">
                  <Label className="text-zinc-700 font-medium flex items-center gap-2">
                    ই-বুক ফাইল (PDF)
                    {!formData.hardCopyAvailable && <span className="text-red-500">*</span>}
                  </Label>
                  <CldUploadWidget 
                    uploadPreset="boighor_uploads" 
                    options={{ maxFiles: 1, resourceType: "raw", clientAllowedFormats: ["pdf"] }}
                    onSuccess={(result: any) => setPdfUrl(result.info.secure_url)}
                  >
                    {({ open }) => (
                      <div 
                        onClick={() => open()} 
                        className={`flex flex-col items-center justify-center h-56 border-2 border-dashed rounded-xl cursor-pointer transition-all ${pdfUrl ? 'border-emerald-500 bg-emerald-50/30' : 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100'}`}
                      >
                        {pdfUrl ? (
                          <div className="flex flex-col items-center text-center px-4">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                              <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <p className="font-semibold text-emerald-700 text-sm">PDF আপলোড সম্পন্ন</p>
                            <p className="text-xs text-emerald-600/70 mt-1 hover:underline">নতুন ফাইল দিন</p>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-zinc-100 flex items-center justify-center mb-3 text-zinc-400">
                              <UploadCloud className="w-5 h-5" />
                            </div>
                            <p className="font-medium text-sm text-zinc-700">ফাইল নির্বাচন করুন</p>
                            <p className="text-[11px] text-zinc-500 mt-1">শুধুমাত্র .pdf ফরমেট</p>
                          </>
                        )}
                      </div>
                    )}
                  </CldUploadWidget>
                </div>

              </CardContent>
            </Card>

          </div>

          {/* Sidebar Column (Right) */}
          <div className="space-y-6">
            
            {/* Digital Pricing Card */}
            <Card className="border-zinc-200 shadow-sm rounded-xl bg-white">
              <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 pb-4">
                <CardTitle className="text-base text-zinc-800">ডিজিটাল প্রাইসিং</CardTitle>
                <CardDescription className="text-xs">ক্রেডিট বা পয়েন্ট সিস্টেম সেট করুন</CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="read_credits" className="text-zinc-700 text-sm font-medium">পড়ার জন্য ফি (Credit)</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <Input id="read_credits" type="number" min="0" value={formData.read_credits} onChange={handleChange} className="h-10 pl-9 rounded-lg border-zinc-200 focus-visible:ring-indigo-500 font-medium" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="download_credits" className="text-zinc-700 text-sm font-medium">ডাউনলোড ফি (Credit)</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      <CloudUpload className="w-4 h-4" />
                    </div>
                    <Input id="download_credits" type="number" min="0" value={formData.download_credits} onChange={handleChange} className="h-10 pl-9 rounded-lg border-zinc-200 focus-visible:ring-indigo-500 font-medium" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hardcopy Card */}
            <Card className={`border shadow-sm rounded-xl transition-colors duration-300 ${formData.hardCopyAvailable ? 'border-indigo-200 bg-white' : 'border-zinc-200 bg-white'}`}>
              <div className={`p-5 flex items-center justify-between border-b ${formData.hardCopyAvailable ? 'border-indigo-100 bg-indigo-50/30' : 'border-zinc-100 bg-zinc-50/50 rounded-t-xl'}`}>
                <div>
                  <h2 className="text-base font-semibold text-zinc-800">ফিজিক্যাল হার্ডকপি</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">বইটির প্রিন্ট কপি বিক্রি করুন</p>
                </div>
                <Switch 
                  checked={formData.hardCopyAvailable} 
                  onCheckedChange={handleCheckboxChange}
                  className="data-[state=checked]:bg-indigo-600"
                />
              </div>
              
              {formData.hardCopyAvailable && (
                <CardContent className="p-5 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="hardCopyPrice" className="text-zinc-700 text-sm font-medium">হার্ড কপির দাম (৳)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-medium text-sm">৳</span>
                      <Input id="hardCopyPrice" type="number" min="0" placeholder="৩০০" value={formData.hardCopyPrice} onChange={handleChange} className="h-10 pl-8 rounded-lg border-zinc-200 focus-visible:ring-indigo-500 font-medium" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hardCopyStock" className="text-zinc-700 text-sm font-medium">বর্তমান স্টক</Label>
                    <Input id="hardCopyStock" type="number" min="0" placeholder="৫০" value={formData.hardCopyStock} onChange={handleChange} className="h-10 rounded-lg border-zinc-200 focus-visible:ring-indigo-500 font-medium" />
                  </div>
                </CardContent>
              )}
            </Card>

          </div>
        </form>
      </div>
    </div>
  );
}