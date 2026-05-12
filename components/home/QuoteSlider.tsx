"use client";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Quote } from "lucide-react";

const quotes = [
  { text: "বই পড়ে কেউ দেউলিয়া হয় না। বই হলো মানুষের সবচেয়ে মূল্যবান সম্পদ।", author: "প্রমথ চৌধুরী" },
  { text: "যে জাতি বই পড়ে না, সে জাতি ইতিহাস গড়তে পারে না।", author: "হুমায়ূন আহমেদ" },
  { text: "একটি ভালো বই হলো সেরা বন্ধু — যে কখনও তোমাকে ছেড়ে যায় না।", author: "রবীন্দ্রনাথ ঠাকুর" },
];

export default function QuoteSlider() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* bg decoration */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(transparent,transparent 38px,#fff 38px,#fff 39px)" }} />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-indigo-600/10 blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-indigo-400 font-baloo italic text-xl mb-2">পাঠকের কথা</p>
          <h2 className="text-4xl font-black font-noto text-white">জ্ঞানীদের বাণী</h2>
        </motion.div>

        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex">
            {quotes.map((q, i) => (
              <div key={i} className="embla__slide flex-[0_0_100%] px-4">
                <div className="max-w-3xl mx-auto">
                  <div className="relative bg-[#FCF5E5] p-12 md:p-16 rounded-[2rem] shadow-2xl -rotate-1 hover:rotate-0 transition-transform duration-700">
                    {/* torn top */}
                    <div className="absolute -top-5 left-0 w-full h-6 bg-[#FCF5E5]" style={{ clipPath: "polygon(0% 100%,3% 60%,7% 95%,12% 70%,18% 100%,25% 65%,32% 90%,40% 70%,50% 95%,60% 60%,70% 95%,82% 70%,92% 100%,100% 75%,100% 100%)" }} />
                    <div className="absolute inset-0 opacity-10 rounded-[2rem]" style={{ backgroundImage: "repeating-linear-gradient(transparent,transparent 29px,rgba(0,0,0,0.5) 29px,rgba(0,0,0,0.5) 30px)" }} />
                    <Quote className="w-12 h-12 text-indigo-200 mb-6 mx-auto" />
                    <p className="text-2xl md:text-4xl font-atma text-slate-800 text-center leading-[1.5] relative z-10">"{q.text}"</p>
                    <div className="mt-8 text-center relative z-10">
                      <div className="w-16 h-1 bg-indigo-500 mx-auto mb-3 rounded-full" />
                      <p className="font-noto text-lg font-bold text-slate-700">— {q.author}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
