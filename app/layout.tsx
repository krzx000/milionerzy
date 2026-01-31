import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutClient } from "./layout-client";
import { Analytics } from "@vercel/analytics/next"
const interSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Zstlionerzy - Gra Quizowa",
  description:
    "Zagraj w polską wersję kultowej gry quizowej Zstlionerzy! Odpowiadaj na pytania, używaj kół ratunkowych i zdobywaj wirtualne miliony. Sprawdź swoją wiedzę w tej emocjonującej grze online.",
  keywords: [
    "Zstlionerzy",
    "gra quizowa",
    "pytania i odpowiedzi",
    "kółka ratunkowe",
    "wirtualne miliony",
  ],
  authors: {
    name: "Krzysztof krzx Padło",
    url: "https://krzx.top/",
  },
  creator: "Krzysztof krzx Padło",
  openGraph: {},
  twitter: {
    card: "summary_large_image",
    title: "Zstlionerzy - Gra Quizowa",
    description:
      "Zagraj w polską wersję kultowej gry quizowej Zstlionerzy! Odpowiadaj na pytania, używaj kół ratunkowych i zdobywaj wirtualne miliony. Sprawdź swoją wiedzę w tej emocjonującej grze online.",
  },
  icons: {
    shortcut: "/logo.webp",
    apple: "/logo.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>
    <LayoutClient fontClass={interSans.variable}>{children}</LayoutClient>
    <Analytics />
  </>;
}
