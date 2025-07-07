import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const interSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Milionerzy - Gra Quizowa",
  description:
    "Zagraj w polską wersję kultowej gry quizowej Milionerzy! Odpowiadaj na pytania, używaj kół ratunkowych i zdobywaj wirtualne miliony. Sprawdź swoją wiedzę w tej emocjonującej grze online.",
  keywords: [
    "Milionerzy",
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
    title: "Milionerzy - Gra Quizowa",
    description:
      "Zagraj w polską wersję kultowej gry quizowej Milionerzy! Odpowiadaj na pytania, używaj kół ratunkowych i zdobywaj wirtualne miliony. Sprawdź swoją wiedzę w tej emocjonującej grze online.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.webp",
    apple: "/logo.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${interSans.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
