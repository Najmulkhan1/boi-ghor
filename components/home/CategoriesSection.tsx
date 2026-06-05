"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Truck, Headphones, ShieldCheck, Gift } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Category {
  name: string;
  count: number;
  emoji: string;
  color: string;
}

interface CategoriesSectionProps {
  categories: Category[];
}

const features = [
  { icon: Truck, title: "দ্রুত ডেলিভারি", desc: "৬৪ জেলায় ৩-৫ দিনে ডেলিভারি" },
  { icon: ShieldCheck, title: "নিরাপদ পেমেন্ট", desc: "বিকাশ, নগদ, কার্ড সব মাধ্যম" },
  { icon: Headphones, title: "২৪/৭ সাপোর্ট", desc: "যেকোনো সমস্যায় আমরা আছি" },
  { icon: Gift, title: "গিফট র‍্যাপিং", desc: "প্রিয়জনকে উপহার দিন সুন্দরভাবে" },
];

export default function CategoriesAndFeatures({ categories }: CategoriesSectionProps) {
  const catSectionRef = useRef<HTMLElement>(null);
  const catHeaderRef = useRef<HTMLDivElement>(null);
  const catGridRef = useRef<HTMLDivElement>(null);
  const featSectionRef = useRef<HTMLElement>(null);
  const featGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Category header ──
      gsap.fromTo(
        catHeaderRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: catHeaderRef.current, start: "top 85%" },
        }
      );

      // ── Category cards — 3D flip stagger ──
      const catCards = catGridRef.current?.querySelectorAll(".cat-card");
      if (catCards) {
        gsap.fromTo(
          catCards,
          { opacity: 0, rotateY: -70, scale: 0.85 },
          {
            opacity: 1,
            rotateY: 0,
            scale: 1,
            duration: 0.75,
            stagger: 0.09,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: catGridRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // ── Features — fan out upward ──
      const featCards = featGridRef.current?.querySelectorAll(".feat-card");
      if (featCards) {
        gsap.fromTo(
          featCards,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: featGridRef.current,
              start: "top 85%",
            },
          }
        );
      }

      // ── Icon pulse on scroll enter ──
      if (featCards) {
        Array.from(featCards).forEach((card) => {
          const icon = card.querySelector(".feat-icon");
          ScrollTrigger.create({
            trigger: card as Element,
            start: "top 80%",
            onEnter: () => {
              gsap.fromTo(
                icon,
                { scale: 0, rotate: -30 },
                { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2)", delay: 0.3 }
              );
            },
          });
        });
      }
    });

    return () => ctx.revert();
  }, [categories]);

  return (
    <>
      {/* CATEGORIES */}
      <section ref={catSectionRef} className="py-28 bg-slate-50 dark:bg-[#0D0D1A]">
        <div className="container mx-auto px-6">
          <div ref={catHeaderRef} className="text-center mb-16 space-y-3">
            <p className="font-baloo text-indigo-500 dark:text-indigo-400 text-lg italic">
              আপনার পছন্দ অনুযায়ী
            </p>
            <h2 className="text-5xl font-black font-noto text-slate-900 dark:text-white">
              ক্যাটাগরি বেছে নিন
            </h2>
          </div>
          <div
            ref={catGridRef}
            className="grid grid-cols-2 md:grid-cols-3 gap-5"
            style={{ perspective: 800 }}
          >
            {categories.map((cat, i) => (
              <a
                href={`/books?category=${encodeURIComponent(cat.name)}`}
                key={i}
                className={`cat-card group relative bg-gradient-to-br ${cat.color} p-7 rounded-[2rem] text-white overflow-hidden cursor-pointer shadow-lg hover:scale-[1.04] hover:-translate-y-1 transition-transform duration-300`}
              >
                <div className="relative z-10">
                  <span className="text-4xl">{cat.emoji}</span>
                  <h3 className="text-xl font-black font-noto mt-3 mb-1">{cat.name}</h3>
                  <p className="text-white/70 text-sm font-hind">{cat.count} বই</p>
                </div>
                <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section ref={featSectionRef} className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6">
          <div ref={featGridRef} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="feat-card text-center space-y-3 group">
                <div className="feat-icon w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <f.icon className="w-7 h-7" />
                </div>
                <h4 className="font-black font-noto text-slate-900 dark:text-white">{f.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-hind leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
