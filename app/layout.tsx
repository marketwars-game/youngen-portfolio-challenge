// FILE: app/layout.tsx — Root layout + document metadata
// VERSION: YG-V1 — MARKET WARS · Portfolio Challenge — KKP YoungGen Edition (EN metadata)
// LAST MODIFIED: 02 Jul 2026
// HISTORY: market-wars B1..B20 (kids-camp lineage — see market-wars repo) | YG-V0 fork | YG-V1 rebrand metadata
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MARKET WARS · Portfolio Challenge — KKP YoungGen Edition",
  description:
    "A live multiplayer portfolio-allocation game for KKP YoungGen. Teams manage ฿1,000,000 across 8 asset classes over 7 challenges.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
