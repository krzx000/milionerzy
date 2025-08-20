"use client";

import * as React from "react";
import Image from "next/image";
import { ConnectionBadge } from "@/components/ui/connection-badge";
import { IMAGES } from "@/lib/utils/game-assets";
import { Coiny, Inter } from "next/font/google";
import useFitText from "use-fit-text";

const COINY = Coiny({
  subsets: ["latin"],
  weight: ["400"],
});

const INTER = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export interface WinScreenProps {
  isConnected: boolean;
  isBackToWaitingTransition: boolean;
  winnings?: string;
}

export function WinScreen({
  isConnected,
  isBackToWaitingTransition,
  winnings,
}: WinScreenProps) {
  const { fontSize: questionFontSize, ref: questionRef } = useFitText({
    maxFontSize: 100,
  });

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${IMAGES.BACKGROUND})` }}
    >
      {/* Status połączenia w prawym górnym rogu */}
      <div className="fixed top-6 right-6 z-50">
        <ConnectionBadge isConnected={isConnected} />
      </div>

      {/* EKRAN WYGRANEJ */}
      <div
        className={`h-screen flex flex-col justify-end transition-all duration-500 ${
          isBackToWaitingTransition ? "opacity-75" : "opacity-100"
        }`}
      >
        {/* Logo w tym samym miejscu */}
        <div className="flex justify-center">
          <Image
            src={IMAGES.LOGO}
            alt="Logo"
            width={512}
            height={512}
            draggable={false}
            className={`w-1/4 select-none transition-all duration-500 ${
              isBackToWaitingTransition ? "opacity-50" : "opacity-100"
            }`}
          />
        </div>

        {/* Obszar pytania teraz z wygraną */}
        <div
          className={`relative transition-all duration-500 ease-in-out bg-cover bg-center bg-no-repeat ${
            isBackToWaitingTransition ? "opacity-75" : "opacity-100"
          }`}
          style={{
            backgroundImage: `url(${IMAGES.QUESTION_BACKGROUND})`,
          }}
        >
          {/* Niewidoczny obrazek dla wymiarów */}
          <Image
            src={IMAGES.QUESTION_BACKGROUND}
            width={1920}
            height={400}
            alt="Wygrana"
            className="w-full invisible"
            draggable={false}
          />

          {/* Napis "WYGRANA" gdzie była nagroda */}
          <div className="absolute top-[31%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-[9%] h-[15%] flex items-center justify-center">
            <p
              style={{ ...COINY.style }}
              className="text-white text-center text-shadow-bold text-2xl font-bold"
            >
              WYGRANA
            </p>
          </div>

          {/* Kwota wygranej gdzie było pytanie */}
          <div
            ref={questionRef}
            className="absolute top-[55%] -translate-y-1/2 h-[40%] left-1/2 -translate-x-1/2 w-[76%] flex items-center justify-center"
          >
            <p
              style={{ ...INTER.style, fontSize: questionFontSize }}
              className="text-white text-center font-bold text-shadow-bold"
            >
              {winnings || "1 000 000 zł"}
            </p>
          </div>
        </div>

        {/* Koła ratunkowe (nieaktywne) */}
        <div className="flex justify-center gap-4">
          <Image
            src={IMAGES.LIFELINES_BACKGROUND.FIFTY_FIFTY.USED}
            alt="Koło ratunkowe 50:50"
            width={512}
            height={512}
            draggable={false}
            className="w-[120px] h-auto select-none opacity-50"
            priority
          />
          <Image
            src={IMAGES.LIFELINES_BACKGROUND.VOTING.USED}
            alt="Koło ratunkowe - pytanie do publiczności"
            width={512}
            height={512}
            draggable={false}
            className="w-[120px] h-auto select-none opacity-50"
            priority
          />
          <Image
            src={IMAGES.LIFELINES_BACKGROUND.PHONE.USED}
            alt="Koło ratunkowe - telefon do przyjaciela"
            width={512}
            height={512}
            draggable={false}
            className="w-[120px] h-auto select-none opacity-50"
            priority
          />
        </div>

        <div></div>

        {/* Miejsce odpowiedzi - puste lub gratulacje */}
        <div className="-space-y-8 relative">
          <div
            className="relative transition-all duration-500 ease-in-out bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${IMAGES.ANSWER_BACKGROUNDS.DEFAULT_DEFAULT})`,
            }}
          >
            <Image
              src={IMAGES.ANSWER_BACKGROUNDS.DEFAULT_DEFAULT}
              width={1920}
              height={150}
              alt="Gratulacje"
              className="w-full invisible"
              draggable={false}
            />

            {/* Gratulacje */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p
                style={{ ...INTER.style }}
                className="text-white text-4xl font-bold text-shadow-bold text-center"
              >
                🎉 GRATULACJE! 🎉
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ekran przejściowy z wygranej do oczekiwania */}
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
