'use client';

import { AppleCardsCarousel } from "@/components/blog/AppleCardsCarousel";
import { BlogSection } from "@/components/blog/BlogSection";
import { FloatingElements } from "@/components/shared";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0b0b0c] overflow-x-hidden">
      <FloatingElements />
      <div className="relative z-10">
        <AppleCardsCarousel />
        <BlogSection />
      </div>
    </div>
  );
}