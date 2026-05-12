"use client";
import { motion } from "framer-motion";
import { BookOpen, Smartphone, Headphones, Gift, Truck, ShieldCheck } from "lucide-react";

const categories = [
  { name: "ইসলামিক বই", emoji: "🕌", color: "from-emerald-500 to-teal-600", count: "২,৩০০+" },
  { name: "উপন্যাস", emoji: "📖", color: "from-rose-500 to-pink-600", count: "১,৮০০+" },
  { name: "প্রোগ্রামিং", emoji: "💻", color: "from-indigo-500 to-violet-600", count: "৮৫০+" },
  { name: "থ্রিলার", emoji: "🔍", color: "from-amber-500 to-orange-600", count: "৬৫০+" },
  { name: "শিশু সাহিত্য", emoji: "🌈", color: "from-sky-500 to-cyan-600", count: "৫০০+" },
  { name: "বিজ্ঞান", emoji: "🔬", color: "from-purple-500 to-fuchsia-600", count: "৪২০+" },
];

const features = [
  { icon: Truck, title: "দ্রুত ডেলিভারি", desc: "৬৪ জেলায় ৩-৫ দিনে ডেলিভারি" },
  { icon: ShieldCheck, title: "নিরাপদ পেমেন্ট", desc: "বিকাশ, নগদ, কার্ড সব মাধ্যম" },
  { icon: Headphones, title: "২৪/৭ সাপোর্ট", desc: "যেকোনো সমস্যায় আমরা আছি" },
  { icon: Gift, title: "গিফট র‍্যাপিং", desc: "প্রিয়জনকে উপহার দিন সুন্দরভাবে" },
];

export default function CategoriesAndFeatures() {
  return (
    <>
      {/* CATEGORIES */}
      <section className="py-28 bg-slate-50 dark:bg-[#0D0D1A]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <p className="font-baloo text-indigo-500 dark:text-indigo-400 text-lg italic">আপনার পছন্দ অনুযায়ী</p>
            <h2 className="text-5xl font-black font-noto text-slate-900 dark:text-white">ক্যাটাগরি বেছে নিন</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {categories.map((cat, i) => (
              <motion.a
                href="/books"
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.04, y: -4 }}
                className={`group relative bg-gradient-to-br ${cat.color} p-7 rounded-[2rem] text-white overflow-hidden cursor-pointer shadow-lg`}
              >
                <div className="relative z-10">
                  <span className="text-4xl">{cat.emoji}</span>
                  <h3 className="text-xl font-black font-noto mt-3 mb-1">{cat.name}</h3>
                  <p className="text-white/70 text-sm font-hind">{cat.count} বই</p>
                </div>
                <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-3 group"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <f.icon className="w-7 h-7" />
                </div>
                <h4 className="font-black font-noto text-slate-900 dark:text-white">{f.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-hind leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
