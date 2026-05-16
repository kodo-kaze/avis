import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AVIS",
  description: "AVIS is a next-generation stakeholder management platform powered by the SYNAPSE-AI engine. Transform raw stakeholder feedback into actionable intelligence through AI-driven sentiment analysis, automated topic discovery, and deep keyword extraction, all delivered via a cutting-edge interactive 3D visualization interface.",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "AVIS",
    description: "AVIS is a next-generation stakeholder management platform powered by the SYNAPSE-AI engine.",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "AVIS Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AVIS",
    description: "AVIS is a next-generation stakeholder management platform powered by the SYNAPSE-AI engine.",
    images: ["/preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-mono", jetbrainsMono.variable)}
      >
        <body className="min-h-full flex flex-col bg-[#050505] text-white">
          <main className="flex-grow flex flex-col">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
