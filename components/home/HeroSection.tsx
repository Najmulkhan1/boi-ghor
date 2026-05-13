"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const h1bRef = useRef<HTMLDivElement>(null);
  const h1cRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const badge1Ref = useRef<HTMLDivElement>(null);
  const badge2Ref = useRef<HTMLDivElement>(null);
  const decBook1Ref = useRef<HTMLDivElement>(null);
  const decBook2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Orbs: slow drift animation ──
      gsap.to(orb1Ref.current, {
        y: -40,
        x: 20,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(orb2Ref.current, {
        y: 30,
        x: -15,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });
      gsap.to(orb3Ref.current, {
        y: -20,
        x: 25,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2,
      });

      // ── Entry timeline ──
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -30, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7 }
      )
        .fromTo(
          h1Ref.current,
          { opacity: 0, x: -80, skewX: -5 },
          { opacity: 1, x: 0, skewX: 0, duration: 0.8 },
          "-=0.3"
        )
        .fromTo(
          h1bRef.current,
          { opacity: 0, x: -60, skewX: -5 },
          { opacity: 1, x: 0, skewX: 0, duration: 0.8 },
          "-=0.5"
        )
        .fromTo(
          h1cRef.current,
          { opacity: 0, x: -60, skewX: -5 },
          { opacity: 1, x: 0, skewX: 0, duration: 0.8 },
          "-=0.5"
        )
        .fromTo(
          paraRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.3"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3"
        )
        .fromTo(
          socialRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          "-=0.2"
        )
        // Right side — book stack
        .fromTo(
          bookRef.current,
          { opacity: 0, scale: 0.7, rotateY: 25 },
          { opacity: 1, scale: 1, rotateY: 0, duration: 1.1, ease: "back.out(1.4)" },
          0.4
        )
        .fromTo(
          badge1Ref.current,
          { opacity: 0, x: -40, y: 20 },
          { opacity: 1, x: 0, y: 0, duration: 0.6, ease: "back.out(2)" },
          "-=0.4"
        )
        .fromTo(
          badge2Ref.current,
          { opacity: 0, x: 40, y: -20 },
          { opacity: 1, x: 0, y: 0, duration: 0.6, ease: "back.out(2)" },
          "-=0.5"
        )
        .fromTo(
          [decBook1Ref.current, decBook2Ref.current],
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 0.5, stagger: 0.15 },
          "-=0.3"
        );

      // ── Floating book loop ──
      gsap.to(bookRef.current, {
        y: -18,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.8,
      });

      // ── Floating badges loop ──
      gsap.to(badge1Ref.current, {
        y: -10,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2,
      });
      gsap.to(badge2Ref.current, {
        y: 10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.5,
      });

      // ── Decorative books wiggle ──
      gsap.to(decBook1Ref.current, {
        rotate: -9,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(decBook2Ref.current, {
        rotate: 9,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });

      // ── Parallax on scroll ──
      gsap.to(orb1Ref.current, {
        y: -120,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-[#FAF8F3] dark:bg-[#0A0A0F]"
    >
      {/* Animated bg dots */}
      <div className="absolute inset-0 bg-dots opacity-60 dark:opacity-30" />

      {/* Floating orbs */}
      <div
        ref={orb1Ref}
        className="absolute top-20 right-20 w-96 h-96 rounded-full bg-indigo-400/20 blur-[100px]"
      />
      <div
        ref={orb2Ref}
        className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-rose-400/20 blur-[80px]"
      />
      <div
        ref={orb3Ref}
        className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-amber-400/10 blur-[60px]"
      />

      <div className="container mx-auto px-6 py-20 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text */}
        <div className="space-y-8">
          {/* Badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-indigo-200/50 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-sm font-bold"
          >
            <Sparkles className="w-4 h-4 fill-current animate-pulse" />
            <span className="font-baloo">বাংলাদেশের সেরা অনলাইন বইঘর</span>
          </div>

          {/* Main heading */}
          <div className="space-y-2">
            <h1
              ref={h1Ref}
              className="text-7xl md:text-8xl font-black font-noto leading-[1.1] text-slate-900 dark:text-white"
            >
              পড়ো,
            </h1>
            <div
              ref={h1bRef}
              className="text-6xl md:text-7xl font-baloo italic"
              style={{ color: "transparent", WebkitTextStroke: "2px #6366f1" }}
            >
              জানো,
            </div>
            <h1
              ref={h1cRef}
              className="text-7xl md:text-8xl font-black font-noto leading-[1.1]"
            >
              <span className="gradient-text-animate">বদলাও।</span>
            </h1>
          </div>

          {/* Subtext */}
          <p
            ref={paraRef}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed font-tiro"
          >
            বই ঘর — যেখানে প্রতিটি বই একটি নতুন দুনিয়ার দরজা। হার্ডকপি থেকে ই-বুক, সব কিছু এক ছাদের নিচে।
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-wrap gap-4 items-center">
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
          </div>

          {/* Social proof */}
          <div ref={socialRef} className="flex items-center gap-4 pt-2">
            <div className="flex -space-x-3">
              {[11, 12, 13, 14, 15].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden bg-slate-200"
                >
                  <img src={`https://i.pravatar.cc/80?img=${i}`} alt="" />
                </div>
              ))}
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-sm">৫০,০০০+ পাঠক</p>
              <p className="text-xs text-slate-500">আমাদের সাথে আছেন</p>
            </div>
          </div>
        </div>

        {/* Right: Floating Book Stack */}
        <div className="hidden lg:flex items-center justify-center relative">
          {/* Main book image */}
          <div ref={bookRef} className="relative">
            <div className="w-72 h-96 rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(99,102,241,0.4)] border-[10px] border-white dark:border-slate-800 rotate-3">
              <img
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop"
                className="w-full h-full object-cover"
                alt="books"
              />
            </div>
            {/* Floating badge — top left */}
            <div
              ref={badge1Ref}
              className="absolute -top-6 -left-10 bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3"
            >
              <span className="text-2xl">📚</span>
              <div>
                <p className="font-black text-lg font-noto">১২,৫০০+</p>
                <p className="text-xs text-slate-500 font-hind">বইয়ের সংগ্রহ</p>
              </div>
            </div>
            {/* Floating badge — bottom right */}
            <div
              ref={badge2Ref}
              className="absolute -bottom-4 -right-8 bg-indigo-600 text-white rounded-2xl px-4 py-3 shadow-xl"
            >
              <p className="font-black text-lg font-noto">৪.৯ ★</p>
              <p className="text-xs opacity-80 font-hind">গ্রাহক রেটিং</p>
            </div>
          </div>

          {/* Background decorative books */}
          <div
            ref={decBook1Ref}
            className="absolute top-8 right-0 w-28 h-40 rounded-2xl overflow-hidden shadow-xl -rotate-6 opacity-70"
          >
            <img
              src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=200&auto=format&fit=crop"
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div
            ref={decBook2Ref}
            className="absolute bottom-10 left-0 w-24 h-36 rounded-2xl overflow-hidden shadow-xl rotate-6 opacity-60"
          >
            <img
              src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=200&auto=format&fit=crop"
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
        </div>
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
