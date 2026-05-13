"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const quotes = [
  { text: "বই পড়ে কেউ দেউলিয়া হয় না। বই হলো মানুষের সবচেয়ে মূল্যবান সম্পদ।", author: "প্রমথ চৌধুরী" },
  { text: "যে জাতি বই পড়ে না, সে জাতি ইতিহাস গড়তে পারে না।", author: "হুমায়ূন আহমেদ" },
  { text: "একটি ভালো বই হলো সেরা বন্ধু — যে কখনও তোমাকে ছেড়ে যায় না।", author: "রবীন্দ্রনাথ ঠাকুর" },
];

export default function QuoteSlider() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const animateCard = (dir: "left" | "right") => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, x: dir === "right" ? 100 : -100, rotate: dir === "right" ? 5 : -5 },
      { opacity: 1, x: 0, rotate: -1, duration: 0.6, ease: "power3.out" }
    );
  };

  const goNext = () => {
    setCurrent((c) => {
      animateCard("right");
      return (c + 1) % quotes.length;
    });
  };

  const goPrev = () => {
    setCurrent((c) => {
      animateCard("left");
      return (c - 1 + quotes.length) % quotes.length;
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Section enter ──
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 85%" },
        }
      );

      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 60, rotate: 0 },
        {
          opacity: 1,
          y: 0,
          rotate: -1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: cardRef.current, start: "top 85%" },
        }
      );

      // ── Orb float ──
      gsap.to(orb1Ref.current, {
        y: -40,
        x: 20,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // ── Card idle wobble ──
      gsap.to(cardRef.current, {
        rotate: -2,
        y: -6,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.2,
      });
    }, sectionRef);

    // Auto-advance
    autoRef.current = setInterval(goNext, 5500);
    return () => {
      ctx.revert();
      if (autoRef.current) clearInterval(autoRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const q = quotes[current];

  return (
    <section ref={sectionRef} className="py-24 bg-slate-950 relative overflow-hidden">
      {/* bg decoration */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(transparent,transparent 38px,#fff 38px,#fff 39px)",
        }}
      />
      <div
        ref={orb1Ref}
        className="absolute top-0 right-0 w-96 h-96 rounded-full bg-indigo-600/10 blur-[120px]"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">
          <p className="text-indigo-400 font-baloo italic text-xl mb-2">পাঠকের কথা</p>
          <h2 className="text-4xl font-black font-noto text-white">জ্ঞানীদের বাণী</h2>
        </div>

        {/* Quote card */}
        <div className="max-w-3xl mx-auto">
          <div
            ref={cardRef}
            className="relative bg-[#FCF5E5] p-12 md:p-16 rounded-[2rem] shadow-2xl cursor-pointer select-none"
          >
            {/* Torn top */}
            <div
              className="absolute -top-5 left-0 w-full h-6 bg-[#FCF5E5]"
              style={{
                clipPath:
                  "polygon(0% 100%,3% 60%,7% 95%,12% 70%,18% 100%,25% 65%,32% 90%,40% 70%,50% 95%,60% 60%,70% 95%,82% 70%,92% 100%,100% 75%,100% 100%)",
              }}
            />
            {/* Lined paper */}
            <div
              className="absolute inset-0 opacity-10 rounded-[2rem]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(transparent,transparent 29px,rgba(0,0,0,0.5) 29px,rgba(0,0,0,0.5) 30px)",
              }}
            />
            <Quote className="w-12 h-12 text-indigo-300 mb-6 mx-auto" />
            <p className="text-2xl md:text-3xl font-atma text-slate-800 text-center leading-[1.6] relative z-10">
              "{q.text}"
            </p>
            <div className="mt-8 text-center relative z-10">
              <div className="w-16 h-1 bg-indigo-500 mx-auto mb-3 rounded-full" />
              <p className="font-noto text-lg font-bold text-slate-700">— {q.author}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={goPrev}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {quotes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    animateCard("right");
                    setCurrent(i);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? "w-8 bg-indigo-400" : "w-2 bg-white/30"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={goNext}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
