"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const marqueeBooks = [
  "প্যারাডক্সিক্যাল সাজিদ", "Atomic Habits", "বেলা ফুরাবার আগে", "The Alchemist",
  "মিসির আলি সমগ্র", "Rich Dad Poor Dad", "আয়নার সামনে", "Think & Grow Rich",
  "হিমু সমগ্র", "Deep Work", "জোছনা ও জননীর গল্প", "The Power of Now",
];

const authorHighlights = [
  { name: "হুমায়ূন আহমেদ", books: "২৩০+ বই", avatar: "https://i.pravatar.cc/120?img=60", genre: "কথাসাহিত্য" },
  { name: "আরিফ আজাদ", books: "১৫+ বই", avatar: "https://i.pravatar.cc/120?img=61", genre: "ইসলামিক" },
  { name: "মুহম্মদ জাফর ইকবাল", books: "১৮০+ বই", avatar: "https://i.pravatar.cc/120?img=62", genre: "বিজ্ঞান ও কল্পকাহিনী" },
  { name: "রবীন্দ্রনাথ ঠাকুর", books: "৫০০+ রচনা", avatar: "https://i.pravatar.cc/120?img=65", genre: "ক্লাসিক" },
];

export default function MarqueeAndAuthors() {
  const authorSectionRef = useRef<HTMLElement>(null);
  const authorHeaderRef = useRef<HTMLDivElement>(null);
  const authorGridRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Continuous marquee via GSAP ──
      if (marqueeRef.current) {
        const items = marqueeRef.current.children;
        const totalWidth = marqueeRef.current.scrollWidth / 2;
        gsap.to(marqueeRef.current, {
          x: -totalWidth,
          duration: 28,
          ease: "none",
          repeat: -1,
        });
      }

      // ── Author header ──
      gsap.fromTo(
        authorHeaderRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: authorHeaderRef.current, start: "top 85%" },
        }
      );

      // ── Author cards — spring pop ──
      const cards = authorGridRef.current?.querySelectorAll(".author-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, scale: 0.5, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: authorGridRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // ── Avatar ring spin on enter ──
      if (cards) {
        Array.from(cards).forEach((card, idx) => {
          const avatar = card.querySelector(".author-avatar");
          ScrollTrigger.create({
            trigger: card as Element,
            start: "top 80%",
            onEnter: () => {
              gsap.fromTo(
                avatar,
                { rotate: -20, scale: 0.6, opacity: 0 },
                { rotate: 0, scale: 1, opacity: 1, duration: 0.6, delay: idx * 0.1, ease: "back.out(2)" }
              );
            },
          });
        });
      }

      // ── Card hover tilt ──
      const cardEls = Array.from(
        authorGridRef.current?.querySelectorAll(".author-card") ?? []
      ) as HTMLElement[];
      cardEls.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { y: -8, scale: 1.03, duration: 0.35, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { y: 0, scale: 1, duration: 0.4, ease: "power2.inOut" });
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* MARQUEE TICKER */}
      <section className="py-6 bg-indigo-600 overflow-hidden">
        <div ref={marqueeRef} className="flex whitespace-nowrap gap-0" style={{ willChange: "transform" }}>
          {[...marqueeBooks, ...marqueeBooks].map((b, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-4 px-6 text-white font-baloo font-bold text-lg"
            >
              {b} <span className="text-indigo-300 text-xl">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* AUTHORS SECTION */}
      <section ref={authorSectionRef} className="py-28 bg-[#FAF8F3] dark:bg-[#0D0D1A]">
        <div className="container mx-auto px-6">
          <div ref={authorHeaderRef} className="text-center mb-16 space-y-3">
            <p className="font-baloo text-indigo-500 italic text-lg">আমাদের সংগ্রহ থেকে</p>
            <h2 className="text-5xl font-black font-noto text-slate-900 dark:text-white">
              জনপ্রিয় লেখকরা
            </h2>
            <p className="text-slate-500 font-tiro max-w-md mx-auto">
              বাংলা সাহিত্যের কিংবদন্তি থেকে আধুনিক লেখক — সবার বই এক জায়গায়
            </p>
          </div>
          <div
            ref={authorGridRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {authorHighlights.map((author, i) => (
              <div
                key={i}
                className="author-card group text-center bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-shadow duration-500 cursor-pointer"
                style={{ willChange: "transform" }}
              >
                <div className="relative w-24 h-24 mx-auto mb-5">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="author-avatar w-full h-full rounded-full object-cover border-4 border-indigo-100 dark:border-indigo-900 group-hover:border-indigo-400 transition-colors"
                  />
                  <div className="absolute inset-0 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-colors" />
                </div>
                <h4 className="font-black font-noto text-slate-900 dark:text-white text-lg mb-1">
                  {author.name}
                </h4>
                <p className="text-indigo-500 dark:text-indigo-400 text-sm font-bold font-hind mb-1">
                  {author.books}
                </p>
                <span className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold font-hind">
                  {author.genre}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
