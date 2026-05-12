"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#FAF8F3] dark:bg-[#0A0A0F]">
      {/* Animated bg dots */}
      <div className="absolute inset-0 bg-dots opacity-60 dark:opacity-30" />

      {/* Floating orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-indigo-400/20 blur-[100px] animate-float-slow" />
      <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-rose-400/20 blur-[80px] animate-float" />
      <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-amber-400/10 blur-[60px] animate-float-slow" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-6 py-20 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-indigo-200/50 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-sm font-bold"
          >
            <Sparkles className="w-4 h-4 fill-current animate-pulse" />
            <span className="font-baloo">বাংলাদেশের সেরা অনলাইন বইঘর</span>
          </motion.div>

          {/* Main heading — mixed handwriting & serif */}
          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-7xl md:text-8xl font-black font-noto leading-[1.1] text-slate-900 dark:text-white"
            >
              পড়ো,
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.8 }}
              className="text-6xl md:text-7xl font-baloo italic"
              style={{ color: "transparent", WebkitTextStroke: "2px #6366f1" }}
            >
              জানো,
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-7xl md:text-8xl font-black font-noto leading-[1.1]"
            >
              <span className="gradient-text-animate">বদলাও।</span>
            </motion.h1>
          </div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed font-tiro"
          >
            বই ঘর — যেখানে প্রতিটি বই একটি নতুন দুনিয়ার দরজা। হার্ডকপি থেকে ই-বুক, সব কিছু এক ছাদের নিচে।
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <Link
              href="/books"
              className="group flex items-center gap-2 px-8 py-4 rounded-full bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-all hover:scale-105 shadow-lg shadow-indigo-500/30 font-baloo"
            >
              বই দেখুন
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/books"
              className="flex items-center gap-2 px-8 py-4 rounded-full border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-lg hover:border-indigo-500 hover:text-indigo-600 transition-all font-baloo"
            >
              <BookOpen className="w-5 h-5" /> ই-বুক পড়ুন
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center gap-4 pt-2"
          >
            <div className="flex -space-x-3">
              {[11, 12, 13, 14, 15].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden bg-slate-200">
                  <img src={`https://i.pravatar.cc/80?img=${i}`} alt="" />
                </div>
              ))}
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-sm">৫০,০০০+ পাঠক</p>
              <p className="text-xs text-slate-500">আমাদের সাথে আছেন</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Floating Book Stack */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="hidden lg:flex items-center justify-center relative"
        >
          {/* Main book image */}
          <div className="relative animate-float">
            <div className="w-72 h-96 rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(99,102,241,0.4)] border-[10px] border-white dark:border-slate-800 rotate-3">
              <img
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop"
                className="w-full h-full object-cover"
                alt="books"
              />
            </div>
            {/* Floating badge — top left */}
            <div className="absolute -top-6 -left-10 bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 animate-bounce-slow">
              <span className="text-2xl">📚</span>
              <div>
                <p className="font-black text-lg font-noto">১২,৫০০+</p>
                <p className="text-xs text-slate-500 font-hind">বইয়ের সংগ্রহ</p>
              </div>
            </div>
            {/* Floating badge — bottom right */}
            <div className="absolute -bottom-4 -right-8 bg-indigo-600 text-white rounded-2xl px-4 py-3 shadow-xl animate-bounce-slow" style={{ animationDelay: "1.5s" }}>
              <p className="font-black text-lg font-noto">৪.৯ ★</p>
              <p className="text-xs opacity-80 font-hind">গ্রাহক রেটিং</p>
            </div>
          </div>

          {/* Background decorative books */}
          <div className="absolute top-8 right-0 w-28 h-40 rounded-2xl overflow-hidden shadow-xl -rotate-6 opacity-70">
            <img src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="" />
          </div>
          <div className="absolute bottom-10 left-0 w-24 h-36 rounded-2xl overflow-hidden shadow-xl rotate-6 opacity-60">
            <img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="" />
          </div>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" className="w-full fill-white dark:fill-slate-950">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}
