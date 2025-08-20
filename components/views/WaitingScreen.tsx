"use client";

import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";
import { IMAGES } from "@/lib/utils/game-assets";
import { Inter } from "next/font/google";

const INTER = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export interface WaitingScreenProps {
  isConnected: boolean;
  isBackToWaitingTransition?: boolean;
  isSessionClosedTransition?: boolean;
}

export function WaitingScreen({
  isConnected,
  isBackToWaitingTransition = false,
  isSessionClosedTransition = false,
}: WaitingScreenProps) {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${IMAGES.BACKGROUND})` }}
    >
      {/* Status połączenia w prawym górnym rogu */}
      <div className="fixed top-6 right-6 z-50">
        {isConnected ? (
          <Badge variant="default" className="bg-green-500 text-white">
            <Wifi className="w-4 h-4 mr-1" />
            Połączono
          </Badge>
        ) : (
          <Badge variant="destructive" className="bg-red-500 text-white">
            <WifiOff className="w-4 h-4 mr-1" />
            Rozłączono
          </Badge>
        )}
      </div>

      <div
        className={`flex flex-col items-center justify-center space-y-8 text-center transition-opacity duration-500 ${
          isBackToWaitingTransition || isSessionClosedTransition
            ? "opacity-0"
            : "opacity-100"
        }`}
      >
        {/* Logo */}
        <div className="mb-8">
          <Image
            src={IMAGES.LOGO}
            alt="Milionerzy Logo"
            width={400}
            height={200}
            className={`drop-shadow-2xl transition-opacity duration-500 ${
              isBackToWaitingTransition || isSessionClosedTransition
                ? "opacity-50"
                : "opacity-100"
            }`}
            priority
          />
        </div>

        {/* Tytuł i status */}
        <div className="space-y-1">
          <div>
            <p
              className="text-2xl text-white font-semibold mb-2"
              style={INTER.style}
            >
              Oczekiwanie na rozpoczęcie kolejnej gry
            </p>
          </div>
        </div>

        {/* Animacja ładowania */}
        <div className="flex space-x-2">
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

      {/* Ekran przejściowy po zamknięciu sesji przez admina */}
      {isSessionClosedTransition && (
        <div className="fixed inset-0 z-[9999] transition-screen-overlay backdrop-blur-2xl bg-black/20">
          <div className="min-h-screen flex items-center justify-center">
            <div className="transition-screen-logo">
              <Image
                src={IMAGES.LOGO}
                alt="Logo Milionerzy"
                width={600}
                height={300}
                className="drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Ekran przejściowy z powrotem do oczekiwania */}
      {isBackToWaitingTransition && (
        <div className="fixed inset-0 z-[9999] transition-screen-overlay backdrop-blur-2xl bg-black/20">
          <div className="min-h-screen flex items-center justify-center">
            <div className="transition-screen-logo">
              <Image
                src={IMAGES.LOGO}
                alt="Logo Milionerzy"
                width={600}
                height={300}
                className="drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
