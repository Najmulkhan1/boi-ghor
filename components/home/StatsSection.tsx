"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { end: 50000, suffix: "+", label: "সক্রিয় পাঠক", icon: "👥", color: "from-indigo-500 to-violet-600" },
  { end: 12500, suffix: "+", label: "বইয়ের সংগ্রহ", icon: "📚", color: "from-amber-500 to-orange-500" },
  { end: 64, suffix: "টি", label: "জেলায় ডেলিভারি", icon: "🚚", color: "from-emerald-500 to-teal-600" },
  { end: 98, suffix: "%", label: "সন্তুষ্ট গ্রাহক", icon: "⭐", color: "from-rose-500 to-pink-600" },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pencilLineRef = useRef<SVGPathElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Pencil underline draws on scroll ──
      const path = pencilLineRef.current;
      if (path) {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: "power2.inOut",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        });
      }

      // ── Cards stagger ──
      const cards = cardsRef.current?.querySelectorAll(".stat-card");
      if (cards) {
        gsap.fromTo(cards,
          { opacity: 0, y: 60, scale: 0.88 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.75, stagger: 0.12, ease: "back.out(1.6)",
            scrollTrigger: { trigger: cardsRef.current, start: "top 80%" },
          }
        );
      }

      // ── Number counters ──
      const counterEls = cardsRef.current?.querySelectorAll(".counter-num");
      counterEls?.forEach((el, i) => {
        const stat = stats[i];
        const obj = { val: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () => {
            gsap.to(obj, {
              val: stat.end,
              duration: 2.2,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = Math.round(obj.val).toLocaleString() + stat.suffix;
              },
            });
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 bg-white dark:bg-slate-950 overflow-hidden">
      {/* Pencil sketch decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] dark:opacity-[0.06]">
        <svg width="800" height="400" viewBox="0 0 800 400" fill="none">
          <path d="M 50,200 C 150,120 250,280 350,200 C 450,120 550,280 650,200 C 720,150 760,180 780,200"
            stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
          <circle cx="400" cy="200" r="180" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="8 6" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section label with pencil underline */}
        <div className="text-center mb-14">
          <div className="relative inline-block">
            <p className="font-baloo text-indigo-500 dark:text-indigo-400 text-lg font-bold mb-2">
              সংখ্যায় বই ঘর
            </p>
            <svg className="absolute -bottom-1 left-0 w-full overflow-visible" viewBox="0 0 200 10" fill="none">
              <path ref={pencilLineRef}
                d="M 2,7 C 40,2 100,9 160,5 C 185,3 196,6 198,7"
                stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="text-5xl font-black font-noto text-slate-900 dark:text-white mt-4">
            আমাদের অর্জন
          </h2>
        </div>

        {/* Stats grid */}
        <div ref={cardsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i}
              className="stat-card relative group bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-400 overflow-hidden"
            >
              {/* Gradient top bar */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${s.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl shadow-lg`}>
                {s.icon}
              </div>
              <div className="counter-num text-4xl font-black text-slate-900 dark:text-white mb-2 font-noto">
                0{s.suffix}
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-hind text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
