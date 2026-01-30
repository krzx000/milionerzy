"use client";


import Image from "next/image";
import { ConnectionBadge } from "@/components/ui/connection-badge";
import { IMAGES } from "@/lib/utils/game-assets";
import { Inter } from "next/font/google";

const INTER = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export interface WaitingScreenProps {
  isConnected: boolean;
}

export function WaitingScreen({ isConnected }: WaitingScreenProps) {
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
            className="drop-shadow-2xl transition-all duration-700 ease-in-out opacity-100"
            priority
          />
        </div>

        {/* Tytuł i status */}
        <div className="space-y-1 transition-all duration-700 ease-in-out delay-200">
          <div>
            <p
              className="text-2xl text-white font-semibold mb-2 transition-all duration-700 ease-in-out delay-300"
              style={INTER.style}
            >
              Oczekiwanie na rozpoczęcie kolejnej gry
            </p>
          </div>
        </div>

        {/* Animacja ładowania */}
        <div className="flex space-x-2 transition-all duration-700 ease-in-out delay-400">
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          <div
            className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
