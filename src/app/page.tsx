import LiquidChromeHero from "@/components/ui/liquid-chrome-hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home – AVIS",
  description: "AVIS homepage – AI‑driven stakeholder insight platform",
};

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-black overflow-hidden">
      <LiquidChromeHero />
    </main>
  );
}
