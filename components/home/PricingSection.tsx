"use client";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const plans = [
  { name: "ফ্রি রিডার", price: "০", period: "সবসময়", features: ["১টি ফ্রি ই-বুক", "বই রিভিউ লিখুন", "কমিউনিটি অ্যাক্সেস"], cta: "শুরু করুন", highlight: false },
  { name: "প্রো লাইব্রেরিয়ান", price: "৪৯৯", period: "প্রতি মাসে", features: ["সব ই-বুক পড়ুন", "৫টি ডাউনলোড/মাস", "বিজ্ঞাপনমুক্ত পড়া", "অগ্রাধিকার সাপোর্ট"], cta: "সদস্য হোন", highlight: true },
  { name: "আল্টিমেট", price: "৯৯৯", period: "প্রতি মাসে", features: ["সব সুবিধা আনলিমিটেড", "হার্ডকপিতে ১৫% ছাড়", "গিফট ভাউচার", "এক্সক্লুসিভ কন্টেন্ট"], cta: "প্রিমিয়াম নিন", highlight: false },
];

const testimonials = [
  { name: "তানভীর আহমেদ", text: "বই ঘর থেকে কেনা প্রতিটি বই দ্রুত পেয়েছি। প্যাকেজিং অসাধারণ!", avatar: "https://i.pravatar.cc/80?img=20", rating: 5 },
  { name: "সুমাইয়া ইসলাম", text: "ই-বুক রিডারটা সত্যিই মনকাড়া। রাতে পড়তে পারি অনায়াসে।", avatar: "https://i.pravatar.cc/80?img=47", rating: 5 },
  { name: "রাফি করিম", text: "দাম একদম ঠিকঠাক। অন্য সাইটের তুলনায় অনেক কম!", avatar: "https://i.pravatar.cc/80?img=33", rating: 5 },
];

export default function PricingAndTestimonials() {
  return (
    <>
      {/* TESTIMONIALS */}
      <section className="py-28 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/20 blur-[120px] rounded-full" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 space-y-3">
            <p className="font-baloo text-indigo-300 text-lg italic">পাঠকদের অভিজ্ঞতা</p>
            <h2 className="text-5xl font-black font-noto text-white">তারা কী বলছেন</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass rounded-3xl p-8 space-y-5"
              >
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-amber-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-white/80 font-tiro leading-relaxed text-base">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border-2 border-indigo-400" />
                  <div>
                    <p className="font-bold text-white font-noto">{t.name}</p>
                    <p className="text-indigo-300 text-xs font-hind">যাচাইকৃত পাঠক</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-28 bg-white dark:bg-[#0A0A0F]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <p className="font-baloo text-indigo-500 text-lg italic">আনলিমিটেড পড়ার সুবিধা</p>
            <h2 className="text-5xl font-black font-noto text-slate-900 dark:text-white">আপনার জন্য সেরা প্ল্যান</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`relative p-8 rounded-[2.5rem] ${
                  plan.highlight
                    ? "bg-indigo-600 text-white scale-105 shadow-2xl shadow-indigo-500/30"
                    : "bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-lg"
                } transition-all`}
              >
                {plan.highlight && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-widest">
                    সবচেয়ে জনপ্রিয়
                  </span>
                )}
                <h3 className={`text-xl font-black font-noto mb-2 ${plan.highlight ? "text-white" : "text-slate-900 dark:text-white"}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-5xl font-black ${plan.highlight ? "text-white" : "text-slate-900 dark:text-white"}`}>৳{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? "text-indigo-200" : "text-slate-400"}`}>/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-3 text-sm font-medium ${plan.highlight ? "text-indigo-100" : "text-slate-600 dark:text-slate-400"}`}>
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${plan.highlight ? "text-white" : "text-indigo-500"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-2xl font-bold font-baloo text-lg transition-all ${
                  plan.highlight
                    ? "bg-white text-indigo-600 hover:bg-indigo-50"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
