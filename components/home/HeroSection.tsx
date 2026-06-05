"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  totalBooks: number;
  totalUsers: number;
}

export default function HeroSection({ totalBooks, totalUsers }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const badgeCircleRef = useRef<SVGEllipseElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const bookWrapRef = useRef<HTMLDivElement>(null);
  const badge1Ref = useRef<HTMLDivElement>(null);
  const badge2Ref = useRef<HTMLDivElement>(null);
  const dec1Ref = useRef<HTMLDivElement>(null);
  const dec2Ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Orb ambient drift
      gsap.to(orb1Ref.current, { y: -50, x: 20, duration: 7, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(orb2Ref.current, { y: 35, x: -20, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 });
      gsap.to(orb3Ref.current, { y: -25, x: 30, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2 });

      // ── Pencil circle around badge ──
      const circle = badgeCircleRef.current;
      if (circle) {
        const len = circle.getTotalLength();
        gsap.set(circle, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(circle, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut", delay: 0.1 });
      }

      // ── Pencil wavy underline ──
      const uLine = underlineRef.current;
      if (uLine) {
        const len = uLine.getTotalLength();
        gsap.set(uLine, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(uLine, { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut", delay: 1.1 });
      }

      // ── Entry timeline ──
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(badgeRef.current, { opacity: 0, y: -20, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 })
        .fromTo(line1Ref.current, { opacity: 0, x: -70, skewX: -4 }, { opacity: 1, x: 0, skewX: 0, duration: 0.75 }, "-=0.2")
        .fromTo(line2Ref.current, { opacity: 0, x: -55, skewX: -4 }, { opacity: 1, x: 0, skewX: 0, duration: 0.75 }, "-=0.55")
        .fromTo(line3Ref.current, { opacity: 0, x: -55, skewX: -4 }, { opacity: 1, x: 0, skewX: 0, duration: 0.75 }, "-=0.55")
        .fromTo(paraRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
        .fromTo(ctaRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.55 }, "-=0.3")
        .fromTo(socialRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.2")
        .fromTo(bookWrapRef.current, { opacity: 0, scale: 0.75, rotateY: 20 }, { opacity: 1, scale: 1, rotateY: 0, duration: 1.1, ease: "back.out(1.4)" }, 0.3)
        .fromTo(badge1Ref.current, { opacity: 0, x: -35, y: 15 }, { opacity: 1, x: 0, y: 0, duration: 0.55, ease: "back.out(2)" }, "-=0.5")
        .fromTo(badge2Ref.current, { opacity: 0, x: 35, y: -15 }, { opacity: 1, x: 0, y: 0, duration: 0.55, ease: "back.out(2)" }, "-=0.45")
        .fromTo([dec1Ref.current, dec2Ref.current], { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.1 }, "-=0.3");

      // Float loop
      gsap.to(bookWrapRef.current, { y: -20, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.5 });
      gsap.to(badge1Ref.current, { y: -10, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.8 });
      gsap.to(badge2Ref.current, { y: 10, duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2.2 });

      // Scroll indicator bounce
      gsap.to(scrollRef.current, { y: 10, duration: 1.3, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2 });

      // Parallax
      gsap.to(orb1Ref.current, {
        y: -140, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden bg-[#FAF8F3] dark:bg-[#07070F]">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
        style={{ backgroundImage: "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Orbs */}
      <div ref={orb1Ref} className="absolute top-24 right-16 w-[500px] h-[500px] rounded-full bg-indigo-400/15 blur-[130px]" />
      <div ref={orb2Ref} className="absolute -bottom-10 left-0 w-80 h-80 rounded-full bg-rose-400/15 blur-[100px]" />
      <div ref={orb3Ref} className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-amber-300/10 blur-[80px]" />

      <div className="container mx-auto px-6 py-24 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT */}
        <div className="space-y-8">
          {/* Badge with pencil circle */}
          <div ref={badgeRef} className="relative inline-flex">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-sm font-bold border border-indigo-200/60 dark:border-indigo-500/20">
              <Sparkles className="w-4 h-4 fill-current" />
              <span className="font-baloo">বাংলাদেশের সেরা অনলাইন বইঘর</span>
            </span>
            {/* Pencil oval */}
            <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <ellipse ref={badgeCircleRef} cx="50" cy="50" rx="54" ry="58"
                stroke="#f59e0b" strokeWidth="0.8" fill="none" strokeLinecap="round"
                style={{ vectorEffect: "non-scaling-stroke" }}
              />
            </svg>
          </div>

          {/* Headings */}
          <div className="space-y-1">
            <div ref={line1Ref} className="text-7xl md:text-8xl font-black font-noto leading-[1.1] text-slate-900 dark:text-white">
              পড়ো,
            </div>
            <div ref={line2Ref} className="text-6xl md:text-7xl font-baloo italic leading-tight"
              style={{ color: "transparent", WebkitTextStroke: "2.5px #6366f1" }}>
              জানো,
            </div>
            <div ref={line3Ref} className="relative inline-block">
              <span className="text-7xl md:text-8xl font-black font-noto leading-[1.1] gradient-text-animate">
                বদলাও।
              </span>
              {/* Pencil wavy underline */}
              <svg className="absolute -bottom-2 left-0 w-full overflow-visible pointer-events-none" viewBox="0 0 320 18" fill="none">
                <path ref={underlineRef}
                  d="M 3,12 C 40,3 80,18 120,10 C 160,2 200,16 240,10 C 268,6 290,12 317,11"
                  stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Para */}
          <p ref={paraRef} className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed font-tiro">
            বই ঘর — যেখানে প্রতিটি বই একটি নতুন দুনিয়ার দরজা। হার্ডকপি থেকে ই-বুক, সব কিছু এক ছাদের নিচে।
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap gap-4 items-center">
            <Link href="/books" className="group flex items-center gap-2 px-8 py-4 rounded-full bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-all hover:scale-105 shadow-lg shadow-indigo-500/30 font-baloo">
              বই দেখুন <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/books" className="flex items-center gap-2 px-8 py-4 rounded-full border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-lg hover:border-indigo-500 hover:text-indigo-600 transition-all font-baloo">
              <BookOpen className="w-5 h-5" /> ই-বুক পড়ুন
            </Link>
          </div>

          {/* Social proof */}
          <div ref={socialRef} className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[11, 12, 13, 14, 15].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden bg-slate-200">
                  <img src={`https://i.pravatar.cc/80?img=${i}`} alt="" />
                </div>
              ))}
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{totalUsers.toLocaleString()}+ সক্রিয় পাঠক</p>
              <p className="text-xs text-slate-500 dark:text-slate-500">আমাদের সাথে আছেন</p>
            </div>
          </div>
        </div>

        {/* RIGHT — Floating book stack */}
        <div className="hidden lg:flex items-center justify-center relative min-h-[500px]">
          <div ref={bookWrapRef} className="relative" style={{ willChange: "transform" }}>
            <div className="w-72 h-96 rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(99,102,241,0.35)] border-[10px] border-white dark:border-slate-800 rotate-3">
              <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop"
                className="w-full h-full object-cover" alt="books" />
            </div>
            <div ref={badge1Ref} className="absolute -top-7 -left-12 bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3 border border-slate-100 dark:border-slate-700">
              <span className="text-2xl">📚</span>
              <div><p className="font-black text-lg font-noto leading-none">{totalBooks.toLocaleString()}+</p><p className="text-xs text-slate-500 font-hind mt-0.5">বইয়ের সংগ্রহ</p></div>
            </div>
            <div ref={badge2Ref} className="absolute -bottom-5 -right-10 bg-indigo-600 text-white rounded-2xl px-4 py-3 shadow-2xl">
              <p className="font-black text-lg font-noto leading-none">৪.৯ ★</p>
              <p className="text-xs opacity-80 font-hind mt-0.5">গ্রাহক রেটিং</p>
            </div>
          </div>

          {/* Decorative books */}
          <div ref={dec1Ref} className="absolute top-6 right-0 w-28 h-40 rounded-2xl overflow-hidden shadow-xl -rotate-6 opacity-75">
            <img src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="" />
          </div>
          <div ref={dec2Ref} className="absolute bottom-8 left-0 w-24 h-36 rounded-2xl overflow-hidden shadow-xl rotate-6 opacity-65">
            <img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="" />
          </div>

          {/* Pencil sketch decorative SVG */}
          <svg className="absolute -bottom-4 -left-4 opacity-20 dark:opacity-10 pointer-events-none" width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="55" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="5 4" />
            <circle cx="60" cy="60" r="40" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 5" />
          </svg>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 dark:text-slate-600">
        <span className="text-xs font-hind tracking-widest uppercase">স্ক্রোল করুন</span>
        <svg width="24" height="36" viewBox="0 0 24 36" fill="none">
          <path d="M12,3 L12,30 M5,22 L12,30 L19,22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
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
