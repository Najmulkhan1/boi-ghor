"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Globe, Users, Smartphone, ShieldCheck } from "lucide-react";

const stats = [
  { icon: Globe, value: "৬৪", label: "জেলায় ডেলিভারি" },
  { icon: Users, value: "৫০,০০০+", label: "সন্তুষ্ট পাঠক" },
  { icon: Smartphone, value: "১২,৫০০+", label: "ই-বুক কালেকশন" },
  { icon: ShieldCheck, value: "১০০%", label: "সুরক্ষিত পেমেন্ট" },
];

export default function NewsletterAndFooter() {
  return (
    <>
      {/* STATS BAR */}
      <section className="py-16 bg-slate-900 dark:bg-black">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-2"
              >
                <s.icon className="w-8 h-8 text-indigo-400 mx-auto" />
                <p className="text-4xl font-black text-white font-noto">{s.value}</p>
                <p className="text-slate-400 text-sm font-hind uppercase tracking-widest">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 bg-white dark:bg-[#0A0A0F]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-indigo-600 via-violet-700 to-purple-800 rounded-[3rem] p-12 md:p-20 text-center overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-dots opacity-20" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-white/10 blur-[80px] rounded-full" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-7">
              {/* Handwriting-style heading */}
              <p className="font-atma text-2xl text-indigo-200 italic">আমাদের পরিবারে যোগ দিন</p>
              <h2 className="text-4xl md:text-6xl font-black text-white font-noto leading-tight">
                নতুন বইয়ের খবর সবার আগে পান!
              </h2>
              <p className="text-indigo-200 font-tiro text-lg">সাবস্ক্রাইব করুন এবং আপনার প্রথম অর্ডারে পান ২০% বিশেষ ছাড়।</p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="আপনার ইমেইল দিন..."
                  className="flex-1 h-14 px-6 rounded-2xl bg-white/15 border border-white/25 text-white placeholder:text-indigo-200 outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-xl font-hind"
                />
                <button className="h-14 px-8 rounded-2xl bg-white text-indigo-700 font-black hover:bg-indigo-50 transition-all hover:scale-105 font-baloo">
                  সাবস্ক্রাইব করুন
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-black border-t border-slate-100 dark:border-slate-900 pt-20 pb-10">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12 text-sm mb-12">
          <div className="space-y-5 md:col-span-1">
            <h2 className="text-3xl font-black font-noto text-indigo-600">বই ঘর</h2>
            <p className="font-baloo italic text-xl text-slate-400 dark:text-slate-500 leading-snug">
              "পাঠকের হৃদয়ের কাছে..."
            </p>
            <p className="text-slate-500 font-tiro leading-relaxed text-sm">বইয়ের প্রতি ভালোবাসা থেকেই জন্ম আমাদের। আমরা বিশ্বাস করি একটি বই একটি পৃথিবী।</p>
          </div>
          {[
            {
              title: "অন্বেষণ", links: ["সব বই", "লেখকরা", "ক্যাটাগরি", "অফার"],
            },
            {
              title: "সহায়তা", links: ["FAQ", "ডেলিভারি ট্র্যাক", "প্রাইভেসি পলিসি", "যোগাযোগ"],
            },
            {
              title: "যোগাযোগ", links: ["📧 info@boighor.com", "📞 01700-000000", "📍 ঢাকা, বাংলাদেশ"],
            },
          ].map((col) => (
            <div key={col.title} className="space-y-5">
              <h4 className="font-black uppercase tracking-widest text-xs text-slate-900 dark:text-white">{col.title}</h4>
              <ul className="space-y-3 text-slate-500 dark:text-slate-400">
                {col.links.map((l) => (
                  <li key={l}><Link href="#" className="hover:text-indigo-600 transition-colors font-hind hw-underline">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="container mx-auto px-6 pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs uppercase tracking-widest font-bold">
          <p>© {new Date().getFullYear()} Boi Ghor. Created with ❤️ by Nazmul Khan.</p>
          <div className="flex gap-6">
            {["Visa", "bKash", "Nagad", "MasterCard"].map(p => <span key={p}>{p}</span>)}
          </div>
        </div>
      </footer>
    </>
  );
}
