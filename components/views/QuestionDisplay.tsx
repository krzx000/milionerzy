"use client";

import * as React from "react";
import Image from "next/image";
import { Textfit } from "react-textfit";
import { IMAGES } from "@/lib/utils/game-assets";
import { Coiny, Inter } from "next/font/google";
import type { Question } from "@/types/question";

const COINY = Coiny({
  subsets: ["latin"],
  weight: ["400"],
});

const INTER = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export interface QuestionDisplayProps {
  currentQuestion: Question | null;
  showGameContent: boolean;
  isTransitioning: boolean;
  isGameStartTransition: boolean;
  isSessionClosedTransition: boolean;
  showWinScreen: boolean;
  currentPrize?: string;
  displayQuestionText?: string;
}

export function QuestionDisplay({
  currentQuestion,
  showGameContent,
  isTransitioning,
  isGameStartTransition,
  isSessionClosedTransition,
  showWinScreen,
  currentPrize,
  displayQuestionText,
}: QuestionDisplayProps) {
  if (!currentQuestion) return null;

  return (
    <div
      className={`relative transition-all duration-500 ease-in-out bg-cover bg-center bg-no-repeat ${
        !showGameContent
          ? "opacity-0"
          : isTransitioning ||
            isGameStartTransition ||
            isSessionClosedTransition
          ? "opacity-75"
          : "opacity-100"
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
        alt="Pytanie"
        className="w-full invisible"
        draggable={false}
      />

      <div className="absolute top-[31%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-[9%] h-[15%] flex items-center justify-center">
        <Textfit
          mode="single"
          min={10}
          max={30}
          style={{
            ...COINY.style,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
          className={`text-shadow-bold ${
            showWinScreen ? "text-green-400" : "text-white"
          }`}
        >
          {showWinScreen ? "WYGRANA" : currentPrize}
        </Textfit>
      </div>

      <div className="absolute top-[55%] -translate-y-1/2 h-[40%] left-1/2 -translate-x-1/2 w-[76%] flex items-center justify-center">
        <Textfit
          mode="single"
          min={20}
          max={50}
          style={{
            ...INTER.style,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
          className="text-white font-bold text-shadow-bold"
        >
          {displayQuestionText}
        </Textfit>
      </div>
    </div>
  );
}
