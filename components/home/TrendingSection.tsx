"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, ShoppingBag, TrendingUp, BookOpen } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

interface Book {
  _id: string;
  title: string;
  slug: string;
  authorName: string;
  coverImage: string;
  hardCopyPrice: number;
  read_credits: number;
  averageRating: number;
  totalReviews: number;
  hardCopyAvailable: boolean;
  categories: string[];
}

interface TrendingSectionProps {
  books: Book[];
}

const TAG_MAP: Record<string, string> = {
  "Islamic": "ইসলামিক",
  "Self-Help": "সেলফ-হেল্প",
  "Novel": "উপন্যাস",
  "Programming": "প্রোগ্রামিং",
  "Thriller": "থ্রিলার",
  "Science": "বিজ্ঞান",
  "Children": "শিশু",
  "History": "ইতিহাস",
  "Biography": "জীবনী",
};

export default function TrendingSection({ books }: TrendingSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Header reveal ──
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
          },
        }
      );

      // ── Cards stagger in ──
      const cards = gridRef.current?.querySelectorAll(".book-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 80, scale: 0.92, rotateX: 10 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.14,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // ── Magnetic hover for each card ──
      const cardEls = Array.from(
        gridRef.current?.querySelectorAll(".book-card") ?? []
      ) as HTMLElement[];
      cardEls.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
          const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
          gsap.to(card, { rotateX: -y, rotateY: x, duration: 0.4, ease: "power2.out", transformPerspective: 800 });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { rotateX: 0, rotateY: 0, y: 0, duration: 0.5, ease: "power2.out" });
        });
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { y: -14, duration: 0.4, ease: "power2.out" });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [books]);

  if (!books || books.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-28 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm font-baloo">
              <TrendingUp className="w-4 h-4" /> এই সপ্তাহের ট্রেন্ড
            </div>
            <h2 className="text-5xl font-black font-noto text-slate-900 dark:text-white leading-tight">
              সবচেয়ে জনপ্রিয় বই
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-tiro max-w-md">
              পাঠকদের পছন্দের তালিকা থেকে বেছে নিন আপনার পরবর্তী বই।
            </p>
          </div>
          <Link
            href="/books"
            className="text-indigo-600 dark:text-indigo-400 font-bold text-lg hover:underline font-baloo flex items-center gap-1"
          >
            সব দেখুন →
          </Link>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          style={{ perspective: 1000 }}
        >
          {books.map((book) => {
            const tag =
              book.categories && book.categories.length > 0
                ? (TAG_MAP[book.categories[0]] ?? book.categories[0])
                : "নতুন";
            const price = book.hardCopyAvailable
              ? book.hardCopyPrice
              : book.read_credits;
            const priceLabel = book.hardCopyAvailable ? `৳${price}` : `${price} ক্রেডিট`;
            return (
              <Link
                href={`/books/${book.slug}`}
                key={book._id}
                className="book-card group bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-shadow duration-500 cursor-pointer block"
                style={{ willChange: "transform" }}
              >
                {/* Cover */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={book.coverImage}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={book.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/300x400/e2e8f0/64748b?text=No+Cover";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                    <button className="w-full py-2.5 rounded-xl bg-white/90 text-slate-900 font-bold text-sm hover:bg-indigo-600 hover:text-white transition-colors font-baloo flex items-center justify-center gap-2">
                      <BookOpen className="w-4 h-4" /> এখনই পড়ুন
                    </button>
                  </div>
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest">
                    {tag}
                  </span>
                </div>

                {/* Info */}
                <div className="p-5 space-y-2">
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest font-hind line-clamp-1">
                    {book.authorName}
                  </p>
                  <h3 className="font-bold text-lg font-noto text-slate-900 dark:text-white line-clamp-2 leading-tight">
                    {book.title}
                  </h3>
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-xl font-black text-slate-900 dark:text-white">
                        {priceLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3 h-3 fill-current" />
                        {book.averageRating > 0
                          ? book.averageRating.toFixed(1)
                          : "নতুন"}
                      </div>
                      <button className="p-2 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors">
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
