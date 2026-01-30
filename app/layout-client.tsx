"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ToasterWrapper } from "@/components/ui/toaster-wrapper";

const AudioProvider = dynamic(
  () => import("@/components/providers/audio-provider").then((mod) => mod.AudioProvider),
  { ssr: false }
);

interface LayoutClientProps {
  children: React.ReactNode;
  fontClass: string;
}

export function LayoutClient({ children, fontClass }: LayoutClientProps) {
  return (
    <html lang="pl">
      <body className={`${fontClass} antialiased`}>
        <Suspense fallback={null}>
          <AudioProvider>
            {children}
            <ToasterWrapper />
          </AudioProvider>
        </Suspense>
      </body>
    </html>
  );
}
