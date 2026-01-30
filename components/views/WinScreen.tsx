"use client";


import Image from "next/image";
import { ConnectionBadge } from "@/components/ui/connection-badge";
import { IMAGES } from "@/lib/utils/game-assets";
import { Inter } from "next/font/google";

const INTER = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export interface WinScreenProps {
  isConnected: boolean;
  winnings: string;
}

export function WinScreen({ isConnected, winnings }: WinScreenProps) {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${IMAGES.BACKGROUND})` }}
    >
      {/* Status połączenia w prawym górnym rogu */}
      <div className="fixed top-6 right-6 z-50">
        <ConnectionBadge isConnected={isConnected} />
      </div>

      <div className="flex flex-col items-center justify-center space-y-8 text-center transition-all duration-700 ease-in-out opacity-100">
        {/* Logo */}
        <div className="mb-8 transition-all duration-700 ease-in-out">
          <Image
            src={IMAGES.LOGO}
            alt="Milionerzy Logo"
            width={400}
            height={200}
            className="drop-shadow-2xl transition-all duration-700 ease-in-out"
            priority
          />
        </div>

        {/* Win Message */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-gold/20 transition-all duration-700 ease-in-out delay-200">
          <h1
            className={`${INTER.className} text-4xl md:text-6xl font-bold text-gold mb-4 drop-shadow-lg`}
          >
            GRATULACJE!
          </h1>

          <p
            className={`${INTER.className} text-xl md:text-2xl text-white mb-6`}
          >
            Wygrałeś
          </p>

          <div
            className={`${INTER.className} text-3xl md:text-5xl font-bold text-gold drop-shadow-lg`}
          >
            {winnings}
          </div>

          <p
            className={`${INTER.className} text-lg md:text-xl text-white/80 mt-6`}
          >
            Dziękujemy za udział w grze!
          </p>
        </div>
      </div>
    </div>
  );
}
