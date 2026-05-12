"use client";
import { motion } from "framer-motion";
import { Star, ShoppingBag, TrendingUp } from "lucide-react";

const books = [
  { id: 1, title: "প্যারাডক্সিক্যাল সাজিদ", author: "আরিফ আজাদ", price: 300, rating: 4.8, tag: "বেস্টসেলার", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop" },
  { id: 2, title: "বেলা ফুরাবার আগে", author: "আরিফ আজাদ", price: 250, rating: 4.9, tag: "নতুন", cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400&auto=format&fit=crop" },
  { id: 3, title: "Atomic Habits", author: "James Clear", price: 350, rating: 5.0, tag: "ট্রেন্ডিং", cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop" },
  { id: 4, title: "Think & Grow Rich", author: "Napoleon Hill", price: 400, rating: 4.7, tag: "ক্লাসিক", cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=400&auto=format&fit=crop" },
];

export default function TrendingSection() {
  return (
    <section className="py-28 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm font-baloo">
              <TrendingUp className="w-4 h-4" /> এই সপ্তাহের ট্রেন্ড
            </div>
            <h2 className="text-5xl font-black font-noto text-slate-900 dark:text-white leading-tight">
              সবচেয়ে জনপ্রিয় বই
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-tiro max-w-md">পাঠকদের পছন্দের তালিকা থেকে বেছে নিন আপনার পরবর্তী বই।</p>
          </div>
          <a href="/books" className="text-indigo-600 dark:text-indigo-400 font-bold text-lg hover:underline font-baloo flex items-center gap-1">
            সব দেখুন →
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {books.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              whileHover={{ y: -12 }}
              className="group bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
            >
              {/* Cover */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img src={book.cover} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={book.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                  <button className="w-full py-2.5 rounded-xl bg-white/90 text-slate-900 font-bold text-sm hover:bg-indigo-600 hover:text-white transition-colors font-baloo">
                    এখনই কিনুন
                  </button>
                </div>
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest">
                  {book.tag}
                </span>
                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-600 hover:text-rose-500 transition-colors backdrop-blur-sm">
                  ♡
                </button>
              </div>

              {/* Info */}
              <div className="p-5 space-y-2">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest font-hind">{book.author}</p>
                <h3 className="font-bold text-lg font-noto text-slate-900 dark:text-white line-clamp-1">{book.title}</h3>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-xl font-black text-slate-900 dark:text-white">৳{book.price}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3 h-3 fill-current" /> {book.rating}
                    </div>
                    <button className="p-2 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors">
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
