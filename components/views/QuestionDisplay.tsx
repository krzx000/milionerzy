"use client";

import * as React from "react";
import Image from "next/image";
import { IMAGES } from "@/lib/utils/game-assets";
import { Coiny, Inter } from "next/font/google";
import useFitText from "use-fit-text";
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
  const { fontSize: questionFontSize, ref: questionRef } = useFitText({
    maxFontSize: 270,
    minFontSize: 50,
  });

  const { fontSize: prizeFontSize, ref: prizeRef } = useFitText({
    maxFontSize: 150,
    minFontSize: 50,
  });

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

      <div
        ref={prizeRef}
        className="absolute top-[31%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-[9%] h-[15%] flex items-center justify-center"
      >
        <p
          style={{ ...COINY.style, fontSize: prizeFontSize }}
          className={`text-center text-shadow-bold ${
            showWinScreen ? "text-green-400" : "text-white"
          }`}
        >
          {showWinScreen ? "WYGRANA" : currentPrize}
        </p>
      </div>

      <div
        ref={questionRef}
        className="absolute top-[55%] -translate-y-1/2 h-[40%] left-1/2 -translate-x-1/2 w-[76%] flex items-center justify-center"
      >
        <p
          style={{ ...INTER.style, fontSize: questionFontSize }}
          className="text-white text-center font-bold text-shadow-bold"
        >
          {displayQuestionText}
        </p>
      </div>
    </div>
  );
}
