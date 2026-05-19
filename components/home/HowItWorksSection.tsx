"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, ShoppingCart, BookOpen } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: "০১",
    icon: Search,
    title: "বই খুঁজুন",
    desc: "আপনার পছন্দের বিষয়, লেখক বা বইয়ের নাম দিয়ে সহজেই খুঁজে নিন।",
    color: "from-indigo-500 to-violet-600",
    accent: "#6366f1",
  },
  {
    num: "০২",
    icon: ShoppingCart,
    title: "অর্ডার করুন",
    desc: "কার্টে যোগ করুন এবং নিরাপদে বিকাশ, নগদ বা কার্ডে পেমেন্ট করুন।",
    color: "from-amber-500 to-orange-500",
    accent: "#f59e0b",
  },
  {
    num: "০৩",
    icon: BookOpen,
    title: "পড়তে শুরু করুন",
    desc: "দ্রুত ডেলিভারিতে বই পান বা তাৎক্ষণিক ই-বুক পড়া শুরু করুন।",
    color: "from-emerald-500 to-teal-600",
    accent: "#10b981",
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const connectPathRef = useRef<SVGPathElement>(null);
  const pencilLineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Header ──
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 85%" } }
      );

      // ── Pencil section label ──
      const pLine = pencilLineRef.current;
      if (pLine) {
        const len = pLine.getTotalLength();
        gsap.set(pLine, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(pLine, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut",
          scrollTrigger: { trigger: headerRef.current, start: "top 80%" } });
      }

      // ── Connector path draws ──
      const cPath = connectPathRef.current;
      if (cPath) {
        const len = cPath.getTotalLength();
        gsap.set(cPath, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(cPath, { strokeDashoffset: 0, duration: 2, ease: "power1.inOut",
          scrollTrigger: { trigger: stepsRef.current, start: "top 80%" } });
      }

      // ── Step cards ──
      const cards = stepsRef.current?.querySelectorAll(".step-card");
      if (cards) {
        gsap.fromTo(cards,
          { opacity: 0, y: 70, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.75, stagger: 0.18, ease: "back.out(1.7)",
            scrollTrigger: { trigger: stepsRef.current, start: "top 78%" } }
        );
      }

      // ── Number pop ──
      const nums = stepsRef.current?.querySelectorAll(".step-num");
      nums?.forEach((el, i) => {
        gsap.fromTo(el,
          { scale: 0, rotate: -30 },
          { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(3)", delay: 0.25 + i * 0.18,
            scrollTrigger: { trigger: stepsRef.current, start: "top 78%" } }
        );
      });

      // ── Hover tilt per card ──
      const cardEls = Array.from(stepsRef.current?.querySelectorAll(".step-card") ?? []) as HTMLElement[];
      cardEls.forEach((card) => {
        card.addEventListener("mouseenter", () => gsap.to(card, { y: -8, scale: 1.03, duration: 0.35, ease: "power2.out" }));
        card.addEventListener("mouseleave", () => gsap.to(card, { y: 0, scale: 1, duration: 0.4, ease: "power2.inOut" }));
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-28 bg-[#FAF8F3] dark:bg-[#0D0D1A] overflow-hidden">
      {/* Pencil sketch bg doodles */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.04]">
        <svg className="absolute top-10 left-10" width="200" height="200" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="90" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="6 5" />
        </svg>
        <svg className="absolute bottom-10 right-10" width="160" height="160" viewBox="0 0 160 160" fill="none">
          <path d="M 10,80 C 40,30 120,130 150,80" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <path d="M 10,90 C 40,40 120,140 150,90" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20 space-y-4">
          <div className="relative inline-block">
            <p className="font-baloo text-indigo-500 dark:text-indigo-400 text-lg italic font-bold">
              মাত্র তিনটি ধাপে
            </p>
            <svg className="absolute -bottom-1 left-0 w-full overflow-visible" viewBox="0 0 220 10" fill="none">
              <path ref={pencilLineRef}
                d="M 2,7 C 50,2 120,9 180,5 C 200,3 213,6 218,7"
                stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="text-5xl font-black font-noto text-slate-900 dark:text-white">
            কীভাবে কাজ করে?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-tiro max-w-lg mx-auto">
            বই ঘরে কেনাকাটা করা এত সহজ — মাত্র কয়েকটি ক্লিকেই আপনার পছন্দের বই পৌঁছে যাবে।
          </p>
        </div>

        {/* Steps + connector */}
        <div className="relative">
          {/* Pencil-drawn connector SVG (desktop only) */}
          <div className="hidden lg:block absolute top-16 left-0 w-full pointer-events-none" style={{ zIndex: 0 }}>
            <svg viewBox="0 0 900 60" fill="none" className="w-full">
              <path ref={connectPathRef}
                d="M 155,30 C 220,15 330,50 450,30 C 570,10 680,50 745,30"
                stroke="#6366f1" strokeWidth="2" strokeLinecap="round"
                strokeDasharray="7 5"
              />
              {/* Arrowheads */}
              <path d="M 440,18 L 450,30 L 460,18" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>

          <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="step-card relative bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-md hover:shadow-2xl hover:shadow-indigo-500/10 transition-shadow duration-500 cursor-default"
                  style={{ willChange: "transform" }}>
                  {/* Number badge */}
                  <div className="step-num absolute -top-5 -left-3 w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 shadow-lg flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400 font-noto text-sm">
                    {step.num}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-black font-noto text-slate-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-tiro leading-relaxed">
                    {step.desc}
                  </p>

                  {/* Pencil corner accent */}
                  <svg className="absolute bottom-4 right-4 opacity-20" width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M 5,35 C 10,20 25,10 35,5" stroke={step.accent} strokeWidth="2" strokeLinecap="round" />
                    <path d="M 15,35 C 20,25 30,18 35,15" stroke={step.accent} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
