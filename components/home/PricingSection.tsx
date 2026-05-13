"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

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
  const testSectionRef = useRef<HTMLElement>(null);
  const testHeaderRef = useRef<HTMLDivElement>(null);
  const testGridRef = useRef<HTMLDivElement>(null);
  const priceSectionRef = useRef<HTMLElement>(null);
  const priceHeaderRef = useRef<HTMLDivElement>(null);
  const priceGridRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Orb float ──
      gsap.to(orbRef.current, {
        y: -30,
        x: 20,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // ── Testimonials header ──
      gsap.fromTo(
        testHeaderRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: testHeaderRef.current, start: "top 85%" },
        }
      );

      // ── Testimonial cards — cascade in ──
      const testCards = testGridRef.current?.querySelectorAll(".test-card");
      if (testCards) {
        gsap.fromTo(
          testCards,
          { opacity: 0, y: 60, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: 0.16,
            ease: "power3.out",
            scrollTrigger: { trigger: testGridRef.current, start: "top 80%" },
          }
        );

        // ── Star rating appear per card ──
        Array.from(testCards).forEach((card) => {
          const stars = card.querySelectorAll(".star");
          ScrollTrigger.create({
            trigger: card as Element,
            start: "top 82%",
            onEnter: () => {
              gsap.fromTo(
                stars,
                { opacity: 0, scale: 0, rotate: -45 },
                { opacity: 1, scale: 1, rotate: 0, duration: 0.35, stagger: 0.07, ease: "back.out(3)", delay: 0.25 }
              );
            },
          });
        });
      }

      // ── Pricing header ──
      gsap.fromTo(
        priceHeaderRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: priceHeaderRef.current, start: "top 85%" },
        }
      );

      // ── Pricing cards — flip in ──
      const priceCards = priceGridRef.current?.querySelectorAll(".price-card");
      if (priceCards) {
        gsap.fromTo(
          priceCards,
          { opacity: 0, rotateY: 40, y: 30 },
          {
            opacity: 1,
            rotateY: 0,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.6)",
            scrollTrigger: { trigger: priceGridRef.current, start: "top 80%" },
          }
        );
      }

      // ── Hover pulse on pricing cards ──
      const priceCardEls = Array.from(
        priceGridRef.current?.querySelectorAll(".price-card") ?? []
      ) as HTMLElement[];
      priceCardEls.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { scale: 1.03, duration: 0.3, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", () => {
          const isHighlight = card.dataset.highlight === "true";
          gsap.to(card, {
            scale: isHighlight ? 1.05 : 1,
            duration: 0.35,
            ease: "power2.inOut",
          });
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* TESTIMONIALS */}
      <section
        ref={testSectionRef}
        className="py-28 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div
          ref={orbRef}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/20 blur-[120px] rounded-full"
        />

        <div className="container mx-auto px-6 relative z-10">
          <div ref={testHeaderRef} className="text-center mb-16 space-y-3">
            <p className="font-baloo text-indigo-300 text-lg italic">পাঠকদের অভিজ্ঞতা</p>
            <h2 className="text-5xl font-black font-noto text-white">তারা কী বলছেন</h2>
          </div>
          <div ref={testGridRef} className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="test-card glass rounded-3xl p-8 space-y-5">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="star text-amber-400 text-lg inline-block">★</span>
                  ))}
                </div>
                <p className="text-white/80 font-tiro leading-relaxed text-base">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full border-2 border-indigo-400"
                  />
                  <div>
                    <p className="font-bold text-white font-noto">{t.name}</p>
                    <p className="text-indigo-300 text-xs font-hind">যাচাইকৃত পাঠক</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section ref={priceSectionRef} className="py-28 bg-white dark:bg-[#0A0A0F]">
        <div className="container mx-auto px-6">
          <div ref={priceHeaderRef} className="text-center mb-16 space-y-3">
            <p className="font-baloo text-indigo-500 text-lg italic">আনলিমিটেড পড়ার সুবিধা</p>
            <h2 className="text-5xl font-black font-noto text-slate-900 dark:text-white">
              আপনার জন্য সেরা প্ল্যান
            </h2>
          </div>
          <div
            ref={priceGridRef}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            style={{ perspective: 800 }}
          >
            {plans.map((plan, i) => (
              <div
                key={i}
                data-highlight={plan.highlight ? "true" : "false"}
                className={`price-card relative p-8 rounded-[2.5rem] transition-shadow duration-300 ${
                  plan.highlight
                    ? "bg-indigo-600 text-white scale-105 shadow-2xl shadow-indigo-500/30"
                    : "bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-lg"
                }`}
                style={{ willChange: "transform" }}
              >
                {plan.highlight && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-widest">
                    সবচেয়ে জনপ্রিয়
                  </span>
                )}
                <h3
                  className={`text-xl font-black font-noto mb-2 ${
                    plan.highlight ? "text-white" : "text-slate-900 dark:text-white"
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span
                    className={`text-5xl font-black ${
                      plan.highlight ? "text-white" : "text-slate-900 dark:text-white"
                    }`}
                  >
                    ৳{plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlight ? "text-indigo-200" : "text-slate-400"}`}>
                    /{plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li
                      key={j}
                      className={`flex items-center gap-3 text-sm font-medium ${
                        plan.highlight ? "text-indigo-100" : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <CheckCircle
                        className={`w-5 h-5 flex-shrink-0 ${
                          plan.highlight ? "text-white" : "text-indigo-500"
                        }`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-4 rounded-2xl font-bold font-baloo text-lg transition-all ${
                    plan.highlight
                      ? "bg-white text-indigo-600 hover:bg-indigo-50"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
