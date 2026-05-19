"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Send, Mail } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function NewsletterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bookPath1Ref = useRef<SVGPathElement>(null);
  const bookPath2Ref = useRef<SVGPathElement>(null);
  const bookPath3Ref = useRef<SVGPathElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Pencil open book draws itself ──
      const paths = [bookPath1Ref.current, bookPath2Ref.current, bookPath3Ref.current];
      paths.forEach((p, i) => {
        if (!p) return;
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(p, {
          strokeDashoffset: 0,
          duration: 1.5,
          delay: i * 0.4,
          ease: "power2.inOut",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        });
      });

      // ── Content slide in ──
      gsap.fromTo(contentRef.current,
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    gsap.fromTo(".success-msg", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(2)" });
  };

  return (
    <section ref={sectionRef} className="relative py-28 overflow-hidden bg-gradient-to-br from-indigo-950 via-[#0f0f2e] to-slate-950">
      {/* Animated orb */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-rose-500/10 blur-[80px] rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          {/* Left: Pencil open book illustration */}
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 300 240" fill="none" className="w-full max-w-sm opacity-90">
              {/* Left page */}
              <path ref={bookPath1Ref}
                d="M 150,200 C 150,200 90,185 30,190 L 30,50 C 90,45 150,60 150,60 Z"
                stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
              {/* Right page */}
              <path ref={bookPath2Ref}
                d="M 150,200 C 150,200 210,185 270,190 L 270,50 C 210,45 150,60 150,60 Z"
                stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
              {/* Lines on pages */}
              <path ref={bookPath3Ref}
                d="M 50,90 L 130,87 M 50,110 L 130,108 M 50,130 L 130,128 M 50,150 L 130,148 M 50,170 L 110,168
                   M 170,87 L 250,90 M 170,108 L 250,110 M 170,128 L 250,130 M 170,148 L 250,150 M 170,168 L 230,170"
                stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round"
              />
              {/* Spine */}
              <path d="M 148,55 L 148,200" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
              <path d="M 152,55 L 152,200" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
              {/* Pencil */}
              <g transform="translate(200, 20) rotate(35)">
                <rect x="0" y="0" width="12" height="70" rx="2" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
                <path d="M 0,70 L 6,85 L 12,70 Z" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinejoin="round" />
                <line x1="0" y1="8" x2="12" y2="8" stroke="#fbbf24" strokeWidth="1" />
                <rect x="3" y="0" width="6" height="8" rx="1" fill="none" stroke="#e2e8f0" strokeWidth="1" />
              </g>
              {/* Sparkles */}
              <text x="22" y="38" fontSize="18" className="opacity-80">✨</text>
              <text x="240" y="200" fontSize="16" className="opacity-60">📖</text>
            </svg>
          </div>

          {/* Right: Content */}
          <div ref={contentRef} className="space-y-7">
            <div>
              <p className="font-baloo text-indigo-300 text-lg italic mb-2">নিউজলেটার সাবস্ক্রাইব করুন</p>
              <h2 className="text-4xl md:text-5xl font-black font-noto text-white leading-tight">
                প্রতি সপ্তাহে নতুন<br />
                <span className="text-indigo-400">বইয়ের খবর পান</span>
              </h2>
              <p className="text-slate-400 font-tiro leading-relaxed mt-4">
                নতুন আগমন, বিশেষ ছাড়, এবং কিউরেটেড বুক রিভিউ — সরাসরি আপনার ইনবক্সে।
              </p>
            </div>

            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="আপনার ইমেইল লিখুন..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-all font-hind"
                  />
                </div>
                <button type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition-all hover:scale-[1.02] shadow-lg shadow-indigo-500/30 font-baloo">
                  <Send className="w-5 h-5" />
                  সাবস্ক্রাইব করুন
                </button>
              </form>
            ) : (
              <div className="success-msg flex items-center gap-3 p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/30">
                <span className="text-3xl">🎉</span>
                <div>
                  <p className="font-black font-noto text-white text-lg">ধন্যবাদ!</p>
                  <p className="text-emerald-300 font-hind text-sm">আপনার সাবস্ক্রিপশন সফল হয়েছে।</p>
                </div>
              </div>
            )}

            {/* Trust badges */}
            <div className="flex items-center gap-6 text-slate-500 text-xs font-hind">
              <span>✓ স্প্যাম নেই</span>
              <span>✓ যেকোনো সময় আনসাবস্ক্রাইব</span>
              <span>✓ ফ্রি</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
