"use client";

import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import TrendingSection from "@/components/home/TrendingSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import QuoteSlider from "@/components/home/QuoteSlider";
import CategoriesSection from "@/components/home/CategoriesSection";
import MarqueeAndAuthors from "@/components/home/AuthorsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import PricingSection from "@/components/home/PricingSection";
import FooterSection from "@/components/home/FooterSection";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl overflow-x-hidden">
      <HeroSection />
      <StatsSection />
      <TrendingSection />
      <HowItWorksSection />
      <QuoteSlider />
      <CategoriesSection />
      <MarqueeAndAuthors />
      <NewsletterSection />
      <PricingSection />
      <FooterSection />
    </div>
  );
}