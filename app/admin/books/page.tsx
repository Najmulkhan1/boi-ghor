"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Library,
  Loader2,
  Search,
  Package,
  Edit3,
  Save,
  CheckCircle2,
  ImageIcon,
  FileText,
  UploadCloud,
  FileSpreadsheet,
  Download,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  // মোডাল হ্যান্ডলিং এর জন্য স্টেট
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // আপলোড স্টেটস
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const fetchBooks = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/books");
    if (res.ok) {
      const data = await res.json();
      setBooks(data.books);
    }
    setLoading(false);
  };

  // নতুন স্টেটস
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkUploading, setBulkUploading] = useState(false);

  // CSV পার্সার (ব্রাউজারে রিড করার জন্য)
  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setBulkUploading(true);
        const text = event.target?.result as string;
        const rows = text.split("\n");

        // প্রথম সারি (Row) হলো হেডার
        const headers = rows[0].split(",").map((h) => h.trim());
        const booksData = [];

        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue; // ফাঁকা লাইন বাদ দেওয়া
          const values = rows[i].split(",").map((v) => v.trim());
          const book: any = {};

          headers.forEach((h, index) => {
            if (
              h === "hardCopyPrice" ||
              h === "hardCopyStock" ||
              h === "read_credits" ||
              h === "download_credits"
            ) {
              book[h] = Number(values[index]) || 0;
            } else {
              book[h] = values[index];
            }
          });
          booksData.push(book);
        }

        // API তে ডেটা পাঠানো
        const res = await fetch("/api/admin/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ books: booksData }),
        });

        const data = await res.json();
        if (res.ok) {
          alert(data.message);
          setIsBulkModalOpen(false);
          fetchBooks(); // টেবিল রিফ্রেশ করা
        } else {
          alert("আপলোড ফেইল হয়েছে: " + data.message);
        }
      } catch (error) {
        alert("ফাইল রিড করতে সমস্যা হয়েছে! সঠিক CSV ফরম্যাট ব্যবহার করুন।");
      } finally {
        setBulkUploading(false);
        e.target.value = ""; // ইনপুট ক্লিয়ার করা
      }
    };
    reader.readAsText(file);
  };

  // ডেমো CSV ডাউনলোড করার ফাংশন
  const downloadDemoCSV = () => {
    const csvContent =
      "title,authorName,category,hardCopyPrice,hardCopyStock,read_credits,download_credits,description,slug\n" +
      "Paradoxical Sajid,Arif Azad,Islamic,300,50,10,20,Best islamic book,paradoxical-sajid\n" +
      "Think and Grow Rich,Napoleon Hill,Self-Help,400,30,15,25,Self help motivation book,think-and-grow-rich";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "demo_books_format.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // ইনলাইন এবং কুইক আপডেটের জন্য (Switch এবং Inline Stock Edit)
  const handleQuickUpdate = async (bookId: string, payload: any) => {
    setUpdating(bookId);
    try {
      const res = await fetch("/api/admin/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, ...payload }),
      });
      if (res.ok) fetchBooks();
    } catch (error) {
      alert("আপডেট ফেইল হয়েছে!");
    } finally {
      setUpdating(null);
    }
  };

  // মোডাল থেকে সম্পূর্ণ ডেটা আপডেটের জন্য
  const handleFullUpdate = async () => {
    if (!selectedBook) return;
    setUpdating("modal_update");

    try {
      const res = await fetch("/api/admin/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: selectedBook._id, ...selectedBook }),
      });

      if (res.ok) {
        alert("সফলভাবে আপডেট হয়েছে!");
        fetchBooks();
        setIsModalOpen(false); // মোডাল বন্ধ করা
      } else {
        alert("আপডেট করতে সমস্যা হয়েছে!");
      }
    } catch (error) {
      alert("সার্ভার এরর!");
    } finally {
      setUpdating(null);
    }
  };

  // সরাসরি ফাইল আপলোড ফাংশন
  const handleFileUpload = async (e: any, type: "image" | "raw") => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "image") setUploadingImg(true);
    else setUploadingPdf(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET as string);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: data,
        },
      );
      const uploadedData = await res.json();

      if (res.ok) {
        if (type === "image")
          setSelectedBook({
            ...selectedBook,
            coverImage: uploadedData.secure_url,
          });
        else
          setSelectedBook({ ...selectedBook, pdfUrl: uploadedData.secure_url });
      }
    } catch (error) {
      alert("ফাইল আপলোডে সমস্যা হয়েছে।");
    } finally {
      if (type === "image") setUploadingImg(false);
      else setUploadingPdf(false);
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title?.toLowerCase().includes(search.toLowerCase()) ||
      book.authorName?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-indigo-600" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Library className="text-indigo-600" /> বই ও স্টক ম্যানেজমেন্ট
        </h1>
        <div className="flex gap-3 w-full md:w-auto">
          <Button
            onClick={() => setIsBulkModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 gap-2 whitespace-nowrap"
          >
            <FileSpreadsheet className="w-4 h-4" /> Bulk Add (CSV)
          </Button>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="বই বা লেখকের নাম..."
              className="pl-10 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-600 text-[10px] uppercase tracking-widest font-bold">
              <th className="px-6 py-4">বই ও লেখক</th>
              <th className="px-6 py-4">হার্ডকপি</th>
              <th className="px-6 py-4">স্টক (Stock)</th>
              <th className="px-6 py-4 text-center">সম্পূর্ণ এডিট</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBooks.map((book) => (
              <tr
                key={book._id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={book.coverImage}
                    className="w-10 h-14 object-cover rounded shadow-sm"
                    alt=""
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900 line-clamp-1">
                      {book.title}
                    </p>
                    <p className="text-xs text-indigo-600 font-medium">
                      {book.authorName}
                    </p>
                  </div>
                </td>

                {/* হার্ডকপি কুইক টগল */}
                <td className="px-6 py-4">
                  <Switch
                    checked={book.hardCopyAvailable}
                    onCheckedChange={(c) =>
                      handleQuickUpdate(book._id, { hardCopyAvailable: c })
                    }
                  />
                </td>

                {/* স্টক কুইক ইনপুট */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Package
                      className={`w-4 h-4 ${book.hardCopyStock < 5 ? "text-red-500" : "text-slate-400"}`}
                    />
                    <Input
                      type="number"
                      disabled={!book.hardCopyAvailable}
                      defaultValue={book.hardCopyStock || 0}
                      className={`w-20 h-8 text-xs font-bold ${book.hardCopyStock < 5 ? "border-red-300 bg-red-50 text-red-700" : ""}`}
                      onBlur={(e) => {
                        const val = Number(e.target.value);
                        if (val !== book.hardCopyStock)
                          handleQuickUpdate(book._id, { hardCopyStock: val });
                      }}
                    />
                    {updating === book._id && (
                      <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedBook({ ...book });
                      setIsModalOpen(true);
                    }}
                    className="gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Full Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal (লুপের বাইরে রাখা হয়েছে যাতে কোনো গ্লিচ না হয়) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>বইয়ের সব তথ্য এডিট করুন</DialogTitle>
          </DialogHeader>

          {selectedBook && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="col-span-full space-y-1">
                <label className="text-xs font-bold text-slate-500">
                  বইয়ের টাইটেল
                </label>
                <Input
                  value={selectedBook.title}
                  onChange={(e) =>
                    setSelectedBook({ ...selectedBook, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">
                  লেখকের নাম
                </label>
                <Input
                  value={selectedBook.authorName}
                  onChange={(e) =>
                    setSelectedBook({
                      ...selectedBook,
                      authorName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">
                  ক্যাটাগরি
                </label>
                <Input
                  value={
                    selectedBook.category || selectedBook.categories?.join(", ")
                  }
                  onChange={(e) =>
                    setSelectedBook({
                      ...selectedBook,
                      category: e.target.value,
                    })
                  }
                />
              </div>

              {/* কভার ইমেজ আপলোড */}
              <div className="space-y-2 border-t pt-2 col-span-full">
                <label className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                  <ImageIcon className="w-4 h-4" /> কভার ইমেজ পরিবর্তন করুন
                </label>
                <div className="flex items-center gap-4 p-3 border rounded-lg bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedBook.coverImage}
                    className="w-12 h-16 object-cover rounded shadow"
                    alt="cover"
                  />
                  <div className="flex-1">
                    {uploadingImg ? (
                      <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold">
                        <Loader2 className="w-4 h-4 animate-spin" /> আপলোড
                        হচ্ছে...
                      </div>
                    ) : (
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "image")}
                        className="file:bg-indigo-50 file:text-indigo-700 file:border-0 file:rounded-md cursor-pointer text-xs"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* পিডিএফ আপলোড */}
              <div className="space-y-2 border-t pt-2 col-span-full">
                <label className="text-xs font-bold text-red-600 flex items-center gap-1">
                  <FileText className="w-4 h-4" /> পিডিএফ ফাইল পরিবর্তন করুন
                </label>
                <div className="flex items-center gap-4 p-3 border rounded-lg bg-slate-50">
                  <div className="flex-1">
                    {uploadingPdf ? (
                      <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold">
                        <Loader2 className="w-4 h-4 animate-spin" /> পিডিএফ
                        আপলোড হচ্ছে...
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-emerald-600 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-4 h-4" /> পিডিএফ যুক্ত আছে
                        </span>
                        <Input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => handleFileUpload(e, "raw")}
                          className="file:bg-red-50 file:text-red-700 file:border-0 file:rounded-md cursor-pointer text-xs"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1 border-t pt-2">
                <label className="text-xs font-bold text-slate-500">
                  হার্ডকপি প্রাইস (৳)
                </label>
                <Input
                  type="number"
                  value={selectedBook.hardCopyPrice || 0}
                  onChange={(e) =>
                    setSelectedBook({
                      ...selectedBook,
                      hardCopyPrice: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-1 border-t pt-2">
                <label className="text-xs font-bold text-slate-500">
                  স্টক সংখ্যা
                </label>
                <Input
                  type="number"
                  value={selectedBook.hardCopyStock || 0}
                  onChange={(e) =>
                    setSelectedBook({
                      ...selectedBook,
                      hardCopyStock: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">
                  Read Credits
                </label>
                <Input
                  type="number"
                  value={selectedBook.read_credits || 0}
                  onChange={(e) =>
                    setSelectedBook({
                      ...selectedBook,
                      read_credits: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">
                  Download Credits
                </label>
                <Input
                  type="number"
                  value={selectedBook.download_credits || 0}
                  onChange={(e) =>
                    setSelectedBook({
                      ...selectedBook,
                      download_credits: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t pt-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              বাতিল
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 gap-2"
              onClick={handleFullUpdate}
              disabled={
                updating === "modal_update" || uploadingImg || uploadingPdf
              }
            >
              {updating === "modal_update" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              সব আপডেট করুন
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Add Modal */}
      <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
  {/* max-w-4xl এবং w-[95vw] দেওয়া হলো যাতে স্ক্রিনে সুন্দরভাবে ফিট হয় */}
  <DialogContent className="!max-w-[80vw] !w-[80vw]  border-none p-0 overflow-hidden bg-white shadow-2xl rounded-2xl max-h-[90vh] flex flex-col">
    
    {/* Header with Background Gradient */}
    <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 md:p-6 text-white shrink-0">
      <DialogHeader>
        <DialogTitle className="text-xl md:text-2xl font-bold flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <FileSpreadsheet className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          একসাথে অনেক বই যুক্ত করুন (Bulk Import)
        </DialogTitle>
        <DialogDescription className="text-emerald-50/90 mt-1.5 md:mt-2 text-sm font-medium">
          সঠিক CSV ফরম্যাট ব্যবহার করে আপনার ডিজিটাল লাইব্রেরি দ্রুত আপডেট করুন।
        </DialogDescription>
      </DialogHeader>
    </div>

    {/* Scrollable Content Area */}
    <div className="p-5 md:p-8 space-y-6 md:space-y-8 overflow-y-auto flex-1">
      
      {/* Step 1: Instruction & Preview */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold shrink-0">
              ১
            </span>
            <h3 className="font-bold text-slate-800 text-base">ডাটা ফরম্যাট এবং ডেমো</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={downloadDemoCSV} 
            className="h-9 gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-all font-semibold w-full sm:w-auto"
          >
            <Download className="w-4 h-4" /> ডেমো CSV ডাউনলোড করুন
          </Button>
        </div>

        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-3 bg-slate-100/80 border-b border-slate-200 flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              টেবিল প্রিভিউ (Example Data)
            </span>
          </div>
          {/* overflow-x-auto নিশ্চিত করবে যে বড় টেবিল হলে স্ক্রল করা যাবে, কেটে যাবে না */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left whitespace-nowrap">
              <thead className="bg-white text-slate-900 font-bold border-b border-slate-200">
                <tr>
                  {["title", "authorName", "category", "hardCopyPrice", "hardCopyStock", "read_credits", "download_credits", "description", "slug"].map((head) => (
                    <th key={head} className="p-3 border-r border-slate-100 last:border-0">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-mono">
                <tr className="bg-white/60 hover:bg-white transition-colors">
                  <td className="p-3 border-r border-slate-100">Paradoxical Sajid</td>
                  <td className="p-3 border-r border-slate-100">Arif Azad</td>
                  <td className="p-3 border-r border-slate-100">Islamic</td>
                  <td className="p-3 border-r border-slate-100 text-center font-bold">300</td>
                  <td className="p-3 border-r border-slate-100 text-center font-bold">50</td>
                  <td className="p-3 border-r border-slate-100 text-center font-bold">10</td>
                  <td className="p-3 border-r border-slate-100 text-center font-bold">20</td>
                  <td className="p-3 border-r border-slate-100 italic text-slate-400">Best islamic book...</td>
                  <td className="p-3 text-emerald-600">paradoxical-sajid</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-rose-50/50 border border-rose-100 p-3 rounded-lg">
          <p className="text-[11px] md:text-xs text-rose-600 flex items-start gap-2 font-medium">
            <span className="mt-0.5 shrink-0 text-lg leading-none">•</span>
            সতর্কীকরণ: আপনার ফাইলের হেডারগুলো অবশ্যই উপরের মতো হতে হবে এবং তথ্যের ভেতরে কোনো কমা (,) ব্যবহার করা যাবে না।
          </p>
        </div>
      </div>

      {/* Step 2: Upload Zone */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold shrink-0">
            ২
          </span>
          <h3 className="font-bold text-slate-800 text-base">ফাইল আপলোড</h3>
        </div>

        <div className="group relative border-2 border-dashed border-slate-300 rounded-2xl p-8 md:p-10 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer bg-slate-50/50">
          <Input 
            id="csv-upload" 
            type="file" 
            accept=".csv" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            onChange={handleBulkUpload} 
            disabled={bulkUploading}
          />
          
          <div className="relative z-0 space-y-4">
            <div className="bg-white w-14 h-14 md:w-16 md:h-16 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <UploadCloud className="w-7 h-7 md:w-8 md:h-8 text-indigo-500" />
            </div>
            
            <div className="space-y-1.5 px-4">
              <p className="text-sm md:text-base font-bold text-slate-700 leading-relaxed">
                আপনার CSV ফাইলটি এখানে ড্রপ করুন অথবা <span className="text-indigo-600 underline underline-offset-2">ব্রাউজ করুন</span>
              </p>
              <p className="text-xs md:text-sm text-slate-400 font-medium">শুধুমাত্র .csv ফাইল সাপোর্ট করবে</p>
            </div>
          </div>

          {/* Uploading Overlay */}
          {bulkUploading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center z-20 transition-all animate-in fade-in duration-300">
              <div className="bg-indigo-600 p-3 rounded-full mb-4 shadow-lg shadow-indigo-200">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              </div>
              <p className="text-sm font-black text-indigo-900">ডাটাবেসে প্রসেসিং হচ্ছে...</p>
              <p className="text-xs text-indigo-500 mt-1.5 font-bold px-4 text-center">অনুগ্রহ করে পেজটি রিফ্রেশ করবেন না</p>
            </div>
          )}
        </div>
      </div>

    </div>
    
    {/* Footer */}
    <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end shrink-0">
      <Button 
        variant="ghost" 
        onClick={() => setIsBulkModalOpen(false)} 
        className="text-slate-600 font-bold hover:bg-slate-200 hover:text-slate-900"
      >
        বন্ধ করুন
      </Button>
    </div>
  </DialogContent>
</Dialog>
    </div>
  );
}
