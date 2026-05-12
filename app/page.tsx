"use client";

import HeroSection from "@/components/home/HeroSection";
import TrendingSection from "@/components/home/TrendingSection";
import QuoteSlider from "@/components/home/QuoteSlider";
import CategoriesSection from "@/components/home/CategoriesSection";
import MarqueeAndAuthors from "@/components/home/AuthorsSection";
import PricingSection from "@/components/home/PricingSection";
import FooterSection from "@/components/home/FooterSection";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <TrendingSection />
      <QuoteSlider />
      <CategoriesSection />
      <MarqueeAndAuthors />
      <PricingSection />
      <FooterSection />
    </div>
  );
}