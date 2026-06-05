"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Plus,
  BookOpen,
  CloudUpload
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
  const router = useRouter();

  // মোডাল হ্যান্ডলিং এর জন্য স্টেট (Edit)
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ==========================================
  // নতুন বই যোগ করার মোডাল স্টেট ও ডেটা (New Add)
  // ==========================================
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addingBook, setAddingBook] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "", slug: "", description: "", authorName: "",
    language: "Bengali", categories: "",
    read_credits: 0, download_credits: 0,
    hardCopyAvailable: false, hardCopyPrice: 0, hardCopyStock: 0,
    coverImage: "", pdfUrl: ""
  });

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

  useEffect(() => {
    fetchBooks();
  }, []);

  // ==========================================
  // নতুন বই যোগ করার ফাংশন (Add New Book Logic)
  // ==========================================
  const handleNewBookChange = (e: any) => {
    const { id, value, type } = e.target;
    setNewBook((prev) => ({ ...prev, [id]: type === "number" ? Number(value) : value }));
  };

  const handleNewTitleChange = (e: any) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    setNewBook(prev => ({ ...prev, title, slug }));
  };

  const handleAddNewBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.title || !newBook.authorName) return alert("বইয়ের নাম এবং লেখকের নাম দেওয়া বাধ্যতামূলক!");
    if (!newBook.coverImage) return alert("অনুগ্রহ করে বইয়ের কভার ছবি আপলোড করুন!");
    if (!newBook.hardCopyAvailable && !newBook.pdfUrl) return alert("ডিজিটাল বইয়ের জন্য PDF আপলোড করা বাধ্যতামূলক!");

    setAddingBook(true);
    try {
      const categoriesArray = newBook.categories.split(",").map(c => c.trim()).filter(Boolean);
      const payload = { ...newBook, categories: categoriesArray };

      const res = await fetch("/api/admin/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // Single Add হিসেবে যাবে
      });

      if (res.ok) {
        alert("নতুন বই সফলভাবে যুক্ত হয়েছে! 🎉");
        setIsAddModalOpen(false);
        fetchBooks();
        router.refresh();
        // ফর্ম রিসেট করা হলো
        setNewBook({
          title: "", slug: "", description: "", authorName: "", language: "Bengali", categories: "",
          read_credits: 0, download_credits: 0, hardCopyAvailable: false, hardCopyPrice: 0, hardCopyStock: 0,
          coverImage: "", pdfUrl: ""
        });
      } else {
        const data = await res.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("সার্ভার এরর! দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setAddingBook(false);
    }
  };

  // ==========================================
  // এডিট ফাংশনসমূহ (Edit Logic)
  // ==========================================
  const handleQuickUpdate = async (bookId: string, payload: any) => {
    setUpdating(bookId);
    try {
      const res = await fetch("/api/admin/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, ...payload }),
      });
      if (res.ok) {
        fetchBooks();
        router.refresh();
      }
    } catch (error) {
      alert("আপডেট ফেইল হয়েছে!");
    } finally {
      setUpdating(null);
    }
  };

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
        alert("সফলভাবে আপডেট হয়েছে!");
        fetchBooks();
        setIsModalOpen(false);
        router.refresh();
      } else {
        alert("আপডেট করতে সমস্যা হয়েছে!");
      }
    } catch (error) {
      alert("সার্ভার এরর!");
    } finally {
      setUpdating(null);
    }
  };

  // 💡 ডায়নামিক ফাইল আপলোড ফাংশন (Edit এবং New দুটোর জন্যই কাজ করবে)
  const handleFileUpload = async (e: any, type: "image" | "raw", targetMode: "edit" | "new") => {
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
        { method: "POST", body: data }
      );
      const uploadedData = await res.json();

      if (res.ok) {
        if (targetMode === "edit") {
          if (type === "image") setSelectedBook({ ...selectedBook, coverImage: uploadedData.secure_url });
          else setSelectedBook({ ...selectedBook, pdfUrl: uploadedData.secure_url });
        } else {
          if (type === "image") setNewBook({ ...newBook, coverImage: uploadedData.secure_url });
          else setNewBook({ ...newBook, pdfUrl: uploadedData.secure_url });
        }
      }
    } catch (error) {
      alert("ফাইল আপলোডে সমস্যা হয়েছে।");
    } finally {
      if (type === "image") setUploadingImg(false);
      else setUploadingPdf(false);
    }
  };

  // ==========================================
  // বাল্ক আপলোড (Bulk Upload Logic)
  // ==========================================
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkUploading, setBulkUploading] = useState(false);

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setBulkUploading(true);
        const text = event.target?.result as string;
        const rows = text.split("\n");

        const headers = rows[0].split(",").map((h) => h.trim());
        const booksData = [];

        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue;
          const values = rows[i].split(",").map((v) => v.trim());
          const book: any = {};

          headers.forEach((h, index) => {
            if (["hardCopyPrice", "hardCopyStock", "read_credits", "download_credits"].includes(h)) {
              book[h] = Number(values[index]) || 0;
            } else {
              book[h] = values[index];
            }
          });
          booksData.push(book);
        }

        const res = await fetch("/api/admin/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ books: booksData }),
        });

        const data = await res.json();
        if (res.ok) {
          alert(data.message);
          setIsBulkModalOpen(false);
          fetchBooks();
        } else {
          alert("আপলোড ফেইল হয়েছে: " + data.message);
        }
      } catch (error) {
        alert("ফাইল রিড করতে সমস্যা হয়েছে! সঠিক CSV ফরম্যাট ব্যবহার করুন।");
      } finally {
        setBulkUploading(false);
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  };

 const downloadDemoCSV = () => {
    const csvContent =
      "title,authorName,category,hardCopyPrice,hardCopyStock,read_credits,download_credits,description,slug,coverImage\n" +
      "Paradoxical Sajid,Arif Azad,Islamic,300,50,10,20,Best islamic book,paradoxical-sajid,https://via.placeholder.com/150\n" +
      "Think and Grow Rich,Napoleon Hill,Self-Help,400,30,15,25,Self help motivation book,think-and-grow-rich,https://via.placeholder.com/150";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "demo_books_format.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title?.toLowerCase().includes(search.toLowerCase()) ||
      book.authorName?.toLowerCase().includes(search.toLowerCase()),
  );



 // ==========================================
  // 💡 Export All Books to CSV Function (Updated with all fields)
  // ==========================================
  const exportBooksToCSV = () => {
    if (!books || books.length === 0) {
      return alert("ডাউনলোড করার মতো কোনো বইয়ের ডেটা নেই!");
    }

    // আপনার দেওয়া লিস্ট অনুযায়ী সব ফিল্ডের হেডার
    const headers = [
      "title", 
      "authorName", 
      "category", 
      "hardCopyPrice", 
      "hardCopyStock", 
      "read_credits", 
      "download_credits", 
      "description", 
      "slug", 
      "coverImage",
      "categories", 
      "language", 
      "read_credits", 
      "download_credits", 
      "hardCopyAvailable", 
      "hardCopyPrice", 
      "totalReviews", 
      "averageRating", 
      "totalReads", 
      "totalSold", 
      "isFeatured"
    ];

    const csvRows = books.map((book) => {
      return headers.map((header) => {
        let val = book[header];

        // ক্যাটাগরি যদি Array হয়, তবে কমা দিয়ে স্ট্রিং এ কনভার্ট করা
        if (header === "categories" && Array.isArray(val)) {
          val = val.join(" | "); 
        } 
        
        // যদি ডাটা না থাকে বা undefined হয়, তবে ফাঁকা স্ট্রিং দেখানো
        if (val === undefined || val === null) {
          val = "";
        }

        // কমা (,) বা লাইন ব্রেক থাকলে তা হ্যান্ডেল করার জন্য স্ট্রিংকে ডাবল কোটেশন ("") এর ভেতরে রাখা হচ্ছে
        if (typeof val === "string") {
          val = val.replace(/"/g, '""'); // এস্কেপ করা
          val = `"${val}"`;
        }
        
        // বুলিয়ান (true/false) ভ্যালুকে স্ট্রিং এ কনভার্ট করা
        if (typeof val === "boolean") {
          val = val ? "true" : "false";
        }

        return val;
      }).join(",");
    });

    // CSV এর কন্টেন্ট তৈরি
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    
    // ডাউনলোড প্রসেস
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    // ডাউনলোড ফাইলের নাম ডায়নামিক করা হয়েছে (যেমন: boighor_all_books_2026-05-16.csv)
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `boighor_all_books_${date}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-indigo-600" />
      </div>
    );

  return (
    <div className="space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="bg-violet-500/20 p-3 rounded-xl text-violet-400">
            <Library className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
              বই ও স্টক ম্যানেজমেন্ট
              <span className="text-sm bg-slate-800 border border-slate-700 text-slate-400 px-3 py-0.5 rounded-full font-medium">{books.length} টি</span>
            </h1>
            <p className="text-sm text-slate-500">নতুন বই যোগ করুন ও হার্ডকপি স্টক আপডেট করুন।</p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto flex-wrap">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> নতুন বই যোগ করুন
          </Button>

          <Button
            onClick={() => setIsBulkModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 gap-2 whitespace-nowrap"
          >
            <FileSpreadsheet className="w-4 h-4" /> Bulk Add (CSV)
          </Button>

          <Button
            onClick={exportBooksToCSV}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-2 whitespace-nowrap"
          >
            <Download className="w-4 h-4" /> Export CSV
          </Button>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="বই বা লেখকের নাম..."
              className="pl-10 h-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/70 border-b border-slate-700 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
              <th className="px-6 py-4">বই ও লেখক</th>
              <th className="px-6 py-4">হার্ডকপি</th>
              <th className="px-6 py-4">স্টক (Stock)</th>
              <th className="px-6 py-4 text-center">সম্পূর্ণ এডিট</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredBooks.map((book) => (
              <tr key={book._id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={book.coverImage || "https://via.placeholder.com/150"}
                    className="w-10 h-14 object-cover rounded shadow-sm"
                    alt=""
                  />
                  <div>
                    <p className="text-sm font-bold text-white line-clamp-1">{book.title}</p>
                    <p className="text-xs text-indigo-400 font-medium">{book.authorName}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Switch
                    checked={book.hardCopyAvailable}
                    onCheckedChange={(c) => handleQuickUpdate(book._id, { hardCopyAvailable: c })}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Package className={`w-4 h-4 ${book.hardCopyStock < 5 ? "text-red-400" : "text-slate-600"}`} />
                    <Input
                      type="number"
                      disabled={!book.hardCopyAvailable}
                      defaultValue={book.hardCopyStock || 0}
                      className={`w-20 h-8 text-xs font-bold bg-slate-800 border-slate-700 text-white ${book.hardCopyStock < 5 ? "!border-red-500/50 !bg-red-500/10 !text-red-400" : ""}`}
                      onBlur={(e) => {
                        const val = Number(e.target.value);
                        if (val !== book.hardCopyStock) handleQuickUpdate(book._id, { hardCopyStock: val });
                      }}
                    />
                    {updating === book._id && <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setSelectedBook({ ...book }); setIsModalOpen(true); }}
                    className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Full Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ======================================================= */}
      {/* 1. ADD NEW BOOK MODAL */}
      {/* ======================================================= */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="!max-w-[80vw] !w-[80vw] max-h-[90vh] overflow-y-auto bg-zinc-50/50 p-0 border-none">
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 py-4 flex justify-between items-center">
            <div>
              <DialogTitle className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" /> নতুন বই পাবলিশ করুন
              </DialogTitle>
              <DialogDescription className="text-xs mt-1">সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন</DialogDescription>
            </div>

           
           
          
            <div className="flex justify-center items-center gap-2">
               <Button variant="ghost" onClick={() => setIsAddModalOpen(false)} className="text-slate-100 hover:bg-red-800 hover:text-white cursor-pointer bg-red-400">বন্ধ করুন</Button>

               <Button onClick={handleAddNewBook} disabled={addingBook} className="bg-indigo-600 hover:bg-indigo-700 gap-2 cursor-pointer">
              {addingBook ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} পাবলিশ করুন
            </Button>
            </div>
           
            
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* General Info Card */}
              <Card className="border-zinc-200 shadow-sm rounded-xl overflow-hidden bg-white">
                <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 pb-4">
                  <CardTitle className="text-base text-zinc-800">সাধারণ তথ্য</CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-zinc-700 font-medium">বইয়ের নাম <span className="text-red-500">*</span></Label>
                    <Input id="title" required placeholder="যেমন: পথের পাঁচালী" value={newBook.title} onChange={handleNewTitleChange} className="rounded-lg" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="authorName" className="text-zinc-700 font-medium">লেখকের নাম <span className="text-red-500">*</span></Label>
                      <Input id="authorName" required placeholder="লেখকের নাম লিখুন" value={newBook.authorName} onChange={handleNewBookChange} className="rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug" className="text-zinc-700 font-medium">ইউআরএল (Slug)</Label>
                      <Input id="slug" required value={newBook.slug} className="bg-zinc-50 rounded-lg cursor-not-allowed" readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categories" className="text-zinc-700 font-medium">ক্যাটাগরি <span className="text-red-500">*</span></Label>
                      <Input id="categories" required placeholder="উপন্যাস, থ্রিলার (কমা দিয়ে)" value={newBook.categories} onChange={handleNewBookChange} className="rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-zinc-700 font-medium">ভাষা</Label>
                      <Input id="language" value={newBook.language} onChange={handleNewBookChange} className="rounded-lg" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-zinc-700 font-medium">বইয়ের সারাংশ <span className="text-red-500">*</span></Label>
                    <Textarea id="description" required placeholder="বইটির বিবরণ লিখুন..." className="h-24 rounded-lg" value={newBook.description} onChange={handleNewBookChange} />
                  </div>
                </CardContent>
              </Card>

              {/* Media Upload Card */}
              <Card className="border-zinc-200 shadow-sm rounded-xl overflow-hidden bg-white">
                <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 pb-4">
                  <CardTitle className="text-base text-zinc-800">মিডিয়া ও ফাইল</CardTitle>
                </CardHeader>
                <CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-zinc-700 font-medium">কভার ছবি <span className="text-red-500">*</span></Label>
                    <CldUploadWidget uploadPreset="boighor_uploads" options={{ maxFiles: 1, resourceType: "image" }} onSuccess={(res: any) => setNewBook({...newBook, coverImage: res.info.secure_url})}>
                      {({ open }) => (
                        <div onClick={() => open()} className={`flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl cursor-pointer ${newBook.coverImage ? 'border-indigo-500 overflow-hidden relative' : 'border-zinc-300 bg-zinc-50'}`}>
                          {newBook.coverImage ? <img src={newBook.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="cover"/> : <ImageIcon className="w-8 h-8 text-zinc-400" />}
                        </div>
                      )}
                    </CldUploadWidget>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-700 font-medium flex gap-1">ই-বুক (PDF) {!newBook.hardCopyAvailable && <span className="text-red-500">*</span>}</Label>
                    <CldUploadWidget uploadPreset="boighor_uploads" options={{ maxFiles: 1, resourceType: "raw", clientAllowedFormats: ["pdf"] }} onSuccess={(res: any) => setNewBook({...newBook, pdfUrl: res.info.secure_url})}>
                      {({ open }) => (
                        <div onClick={() => open()} className={`flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl cursor-pointer ${newBook.pdfUrl ? 'border-emerald-500 bg-emerald-50' : 'border-zinc-300 bg-zinc-50'}`}>
                          {newBook.pdfUrl ? <CheckCircle2 className="w-8 h-8 text-emerald-500" /> : <UploadCloud className="w-8 h-8 text-zinc-400" />}
                        </div>
                      )}
                    </CldUploadWidget>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Digital Pricing Card */}
              <Card className="border-zinc-200 shadow-sm rounded-xl bg-white">
                <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 pb-4"><CardTitle className="text-base">ডিজিটাল প্রাইসিং</CardTitle></CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="read_credits">পড়ার জন্য ফি (Credit)</Label>
                    <Input id="read_credits" type="number" min="0" value={newBook.read_credits} onChange={handleNewBookChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="download_credits">ডাউনলোড ফি (Credit)</Label>
                    <Input id="download_credits" type="number" min="0" value={newBook.download_credits} onChange={handleNewBookChange} />
                  </div>
                </CardContent>
              </Card>

              {/* Hardcopy Card */}
              <Card className="border-zinc-200 shadow-sm rounded-xl bg-white">
                <div className="p-4 flex items-center justify-between border-b">
                  <h2 className="text-sm font-semibold text-zinc-800">ফিজিক্যাল হার্ডকপি বিক্রি করবেন?</h2>
                  <Switch checked={newBook.hardCopyAvailable} onCheckedChange={(c) => setNewBook({...newBook, hardCopyAvailable: c})} />
                </div>
                {newBook.hardCopyAvailable && (
                  <CardContent className="p-5 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hardCopyPrice">হার্ড কপির দাম (৳)</Label>
                      <Input id="hardCopyPrice" type="number" min="0" value={newBook.hardCopyPrice} onChange={handleNewBookChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hardCopyStock">বর্তমান স্টক</Label>
                      <Input id="hardCopyStock" type="number" min="0" value={newBook.hardCopyStock} onChange={handleNewBookChange} />
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ======================================================= */}
      {/* 2. EDIT BOOK MODAL */}
      {/* ======================================================= */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>বইয়ের সব তথ্য এডিট করুন</DialogTitle>
          </DialogHeader>

          {selectedBook && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="col-span-full space-y-1">
                <label className="text-xs font-bold text-slate-500">বইয়ের টাইটেল</label>
                <Input value={selectedBook.title} onChange={(e) => setSelectedBook({ ...selectedBook, title: e.target.value })} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">লেখকের নাম</label>
                <Input value={selectedBook.authorName} onChange={(e) => setSelectedBook({ ...selectedBook, authorName: e.target.value })} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">ক্যাটাগরি</label>
                <Input value={selectedBook.category || selectedBook.categories?.join(", ")} onChange={(e) => setSelectedBook({ ...selectedBook, category: e.target.value })} />
              </div>

              {/* কভার ইমেজ আপলোড (Edit) */}
              <div className="space-y-2 border-t pt-2 col-span-full">
                <label className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                  <ImageIcon className="w-4 h-4" /> কভার ইমেজ পরিবর্তন করুন
                </label>
                <div className="flex items-center gap-4 p-3 border rounded-lg bg-slate-50">
                  <img src={selectedBook.coverImage} className="w-12 h-16 object-cover rounded shadow" alt="cover" />
                  <div className="flex-1">
                    {uploadingImg ? (
                      <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold"><Loader2 className="w-4 h-4 animate-spin" /> আপলোড হচ্ছে...</div>
                    ) : (
                      <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "image", "edit")} className="text-xs" />
                    )}
                  </div>
                </div>
              </div>

              {/* পিডিএফ আপলোড (Edit) */}
              <div className="space-y-2 border-t pt-2 col-span-full">
                <label className="text-xs font-bold text-red-600 flex items-center gap-1">
                  <FileText className="w-4 h-4" /> পিডিএফ ফাইল পরিবর্তন করুন
                </label>
                <div className="flex items-center gap-4 p-3 border rounded-lg bg-slate-50">
                  <div className="flex-1">
                    {uploadingPdf ? (
                      <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold"><Loader2 className="w-4 h-4 animate-spin" /> পিডিএফ আপলোড হচ্ছে...</div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {selectedBook.pdfUrl && <span className="text-xs text-emerald-600 flex items-center gap-1 font-bold"><CheckCircle2 className="w-4 h-4" /> পিডিএফ যুক্ত আছে</span>}
                        <Input type="file" accept="application/pdf" onChange={(e) => handleFileUpload(e, "raw", "edit")} className="text-xs" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1 border-t pt-2">
                <label className="text-xs font-bold text-slate-500">হার্ডকপি প্রাইস (৳)</label>
                <Input type="number" value={selectedBook.hardCopyPrice || 0} onChange={(e) => setSelectedBook({ ...selectedBook, hardCopyPrice: Number(e.target.value) })} />
              </div>

              <div className="space-y-1 border-t pt-2">
                <label className="text-xs font-bold text-slate-500">স্টক সংখ্যা</label>
                <Input type="number" value={selectedBook.hardCopyStock || 0} onChange={(e) => setSelectedBook({ ...selectedBook, hardCopyStock: Number(e.target.value) })} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Read Credits</label>
                <Input type="number" value={selectedBook.read_credits || 0} onChange={(e) => setSelectedBook({ ...selectedBook, read_credits: Number(e.target.value) })} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Download Credits</label>
                <Input type="number" value={selectedBook.download_credits || 0} onChange={(e) => setSelectedBook({ ...selectedBook, download_credits: Number(e.target.value) })} />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t pt-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>বাতিল</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2" onClick={handleFullUpdate} disabled={updating === "modal_update" || uploadingImg || uploadingPdf}>
              {updating === "modal_update" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} সব আপডেট করুন
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ======================================================= */}
      {/* 3. BULK ADD MODAL */}
      {/* ======================================================= */}
      <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
        <DialogContent className="!max-w-[80vw] !w-[80vw] border-none p-0 overflow-hidden bg-white shadow-2xl rounded-2xl max-h-[90vh] flex flex-col">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 md:p-6 text-white shrink-0">
            <DialogHeader>
              <DialogTitle className="text-xl md:text-2xl font-bold flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm"><FileSpreadsheet className="w-5 h-5 md:w-6 md:h-6 text-white" /></div>
                একসাথে অনেক বই যুক্ত করুন (Bulk Import)
              </DialogTitle>
              <DialogDescription className="text-emerald-50/90 mt-1.5 md:mt-2 text-sm font-medium">সঠিক CSV ফরম্যাট ব্যবহার করে আপনার ডিজিটাল লাইব্রেরি দ্রুত আপডেট করুন।</DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-5 md:p-8 space-y-6 md:space-y-8 overflow-y-auto flex-1">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold shrink-0">১</span>
                  <h3 className="font-bold text-slate-800 text-base">ডাটা ফরম্যাট এবং ডেমো</h3>
                </div>
                <Button variant="outline" size="sm" onClick={downloadDemoCSV} className="h-9 gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold w-full sm:w-auto">
                  <Download className="w-4 h-4" /> ডেমো CSV ডাউনলোড করুন
                </Button>
              </div>

              <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-3 bg-slate-100/80 border-b border-slate-200 flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-500" /> <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">টেবিল প্রিভিউ</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left whitespace-nowrap">
                    <thead className="bg-white text-slate-900 font-bold border-b border-slate-200">
                      <tr>
                        {/* 💡 coverImage হেডার যোগ করা হলো */}
                        {["title", "authorName", "category", "hardCopyPrice", "hardCopyStock", "read_credits", "download_credits", "description", "slug", "coverImage"].map((head) => (
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
                        <td className="p-3 text-emerald-600 border-r border-slate-100">paradoxical-sajid</td>
                        {/* 💡 coverImage এর প্রিভিউ ডাটা */}
                        <td className="p-3 text-blue-500 truncate max-w-[150px]">https://via...</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold shrink-0">২</span>
                <h3 className="font-bold text-slate-800 text-base">ফাইল আপলোড</h3>
              </div>

              <div className="group relative border-2 border-dashed border-slate-300 rounded-2xl p-8 md:p-10 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer bg-slate-50/50">
                <Input id="csv-upload" type="file" accept=".csv" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleBulkUpload} disabled={bulkUploading} />
                <div className="relative z-0 space-y-4">
                  <div className="bg-white w-14 h-14 md:w-16 md:h-16 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <UploadCloud className="w-7 h-7 md:w-8 md:h-8 text-indigo-500" />
                  </div>
                  <div className="space-y-1.5 px-4">
                    <p className="text-sm md:text-base font-bold text-slate-700 leading-relaxed">আপনার CSV ফাইলটি এখানে ড্রপ করুন অথবা <span className="text-indigo-600 underline">ব্রাউজ করুন</span></p>
                    <p className="text-xs md:text-sm text-slate-400 font-medium">শুধুমাত্র .csv ফাইল সাপোর্ট করবে</p>
                  </div>
                </div>

                {bulkUploading && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center z-20">
                    <div className="bg-indigo-600 p-3 rounded-full mb-4 shadow-lg"><Loader2 className="w-6 h-6 animate-spin text-white" /></div>
                    <p className="text-sm font-black text-indigo-900">ডাটাবেসে প্রসেসিং হচ্ছে...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end shrink-0">
            <Button variant="ghost" onClick={() => setIsBulkModalOpen(false)} className="text-slate-600 font-bold hover:bg-slate-200">বন্ধ করুন</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}