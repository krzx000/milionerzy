"use client";

import Image from "next/image";
import { Inter, Coiny } from "next/font/google";
import { useRef, useLayoutEffect, useState, CSSProperties, ReactNode } from "react";
// Prosty zamiennik Textfit do jednowierszowego tekstu
interface AutoFontSizeProps {
  min?: number;
  max?: number;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  fontFamily?: string;
}

function AutoFontSize({
  min = 10,
  max = 30,
  children,
  style,
  className = "",
  fontFamily,
}: AutoFontSizeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(max);

  useLayoutEffect(() => {
    if (!containerRef.current || !textRef.current) return;
    const container = containerRef.current;
    const text = textRef.current;
    let current = max;
    text.style.fontSize = `${current}px`;
    const fits = () => text.scrollWidth <= container.offsetWidth && text.offsetHeight <= container.offsetHeight;
    while (current > min && !fits()) {
      current -= 1;
      text.style.fontSize = `${current}px`;
    }
    setFontSize(current);
  }, [children, min, max, style]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", ...style, display: "flex", alignItems: "center", justifyContent: "flex-start", textAlign: "left", fontFamily }}
      className={className}
    >
      <span ref={textRef} style={{ fontSize, width: "100%", whiteSpace: "nowrap",  textOverflow: "ellipsis" }}>
        {children}
      </span>
    </div>
  );
}
// import { Textfit } from "react-textfit";
import {
  IMAGES,
  getAnswerRowBackground,
  type AnswerKey,
} from "@/lib/utils/game-assets";
import type { Question } from "@/types/question";

const INTER = Inter({ subsets: ["latin"] });
const COINY = Coiny({ subsets: ["latin"], weight: "400" });

interface AnswersDisplayProps {
  currentQuestion: Question;
  questionIndex: number;
  showGameContent: boolean;
  showWinScreen: boolean;
  isTransitioning: boolean;
  selectedAnswer: string | null;
  correctAnswer: string | null;
  isAnswerRevealed: boolean;
  lifelineResult: AnswerKey[];
}

export function AnswersDisplay({
  currentQuestion,
  questionIndex,
  showGameContent,
  showWinScreen,
  isTransitioning,
  selectedAnswer,
  correctAnswer,
  isAnswerRevealed,
  lifelineResult,
}: AnswersDisplayProps) {
  // Funkcja sprawdzająca czy odpowiedź jest widoczna
  const isAnswerVisible = (key: AnswerKey): boolean => {
    return lifelineResult.includes(key);
  };

  // Funkcja do pobierania stanu odpowiedzi
  const getAnswerState = (
    key: AnswerKey
  ): "default" | "selected" | "correct" => {
    // Pierwszeństwo ma ujawniona poprawna odpowiedź
    if (isAnswerRevealed && correctAnswer === key) return "correct";
    // Jeśli odpowiedź jest zaznaczona (niezależnie od tego czy jest ujawniona czy nie)
    if (selectedAnswer === key) return "selected";
    return "default";
  };
  return (
    <div
      className={`-space-y-8 relative transition-all duration-500 ${
        !showGameContent || showWinScreen || isTransitioning
          ? "opacity-0 pointer-events-none"
          : "opacity-100"
      }`}
    >
      {/* Rząd A i B */}
      <div
        className="relative transition-all duration-500 ease-in-out bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${getAnswerRowBackground(
            getAnswerState("A"),
            getAnswerState("B")
          )})`,
        }}
      >
        {/* Niewidoczny obrazek dla wymiarów */}
        <Image
          src={getAnswerRowBackground(getAnswerState("A"), getAnswerState("B"))}
          width={1920}
          height={150}
          alt="Odpowiedzi A i B"
          className="w-full invisible"
          draggable={false}
        />

        {/* Odpowiedź A */}
        {isAnswerVisible("A") && (
          <div className="absolute left-[14.5%] top-1/2 -translate-y-1/2 w-[29%] h-[50%] flex items-center">
            <div className="flex justify-start items-center w-full">
              <AutoFontSize
                min={18}
                max={30}
                style={INTER.style}
                className="text-white font-bold"
                fontFamily={INTER.style.fontFamily as string}
              >
                <div className="flex gap-4">
                  <span style={INTER.style} className="font-extrabold">
                    A:
                  </span>
                  <span>{currentQuestion.answers.A}</span>
                </div>
              </AutoFontSize>
            </div>
          </div>
        )}

        {/* Odpowiedź B */}
        {isAnswerVisible("B") && (
          <div className="absolute right-[14.5%] top-1/2 -translate-y-1/2 w-[29%] h-[50%] flex items-center">
            <div className="flex justify-start items-center w-full">
              <AutoFontSize
                min={18}
                max={30}
                style={INTER.style}
                className="text-white font-bold"
                fontFamily={INTER.style.fontFamily as string}
              >
                <div className="flex gap-4">
                  <span style={INTER.style} className="font-extrabold">
                    B:
                  </span>
                  <span>{currentQuestion.answers.B}</span>
                </div>
              </AutoFontSize>
            </div>
          </div>
        )}
      </div>

      {/* Numer pytania w środku */}
      <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-fit h-[55%]">
        <span
          style={{ ...COINY.style }}
          className="absolute left-1/2 top-[52%] -translate-y-1/2 -translate-x-1/2 text-white text-4xl text-shadow-bold"
        >
          {questionIndex + 1}
        </span>
        <Image
          src={IMAGES.QUESTION_INDEX_BACKGROUND}
          alt="Indeks pytania"
          width={256}
          height={256}
          className="h-full w-full"
        />
      </div>

      {/* Rząd C i D */}
      <div
        className="relative transition-all duration-500 ease-in-out bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${getAnswerRowBackground(
            getAnswerState("C"),
            getAnswerState("D")
          )})`,
        }}
      >
        {/* Niewidoczny obrazek dla wymiarów */}
        <Image
          src={getAnswerRowBackground(getAnswerState("C"), getAnswerState("D"))}
          width={1920}
          height={150}
          alt="Odpowiedzi C i D"
          className="w-full invisible"
          draggable={false}
        />

        {/* Odpowiedź C */}
        {isAnswerVisible("C") && (
          <div className="absolute left-[14.5%] top-1/2 -translate-y-1/2 w-[29%] h-[50%] flex items-center">
            <div className="flex justify-start items-center w-full">
              <AutoFontSize
                min={18}
                max={30}
                style={INTER.style}
                className="text-white font-bold"
                fontFamily={INTER.style.fontFamily as string}
              >
                <div className="flex gap-4">
                  <span style={INTER.style} className="font-extrabold">
                    C:
                  </span>
                  <span>{currentQuestion.answers.C}</span>
                </div>
              </AutoFontSize>
            </div>
          </div>
        )}

        {/* Odpowiedź D */}
        {isAnswerVisible("D") && (
          <div className="absolute right-[14.5%] top-1/2 -translate-y-1/2 w-[29%] h-[50%] flex items-center">
            <div className="flex justify-start items-center w-full">
              <AutoFontSize
                min={18}
                max={30}
                style={INTER.style}
                className="text-white font-bold"
                fontFamily={INTER.style.fontFamily as string}
              >
                <div className="flex gap-4">
                  <span style={INTER.style} className="font-extrabold">
                    D:
                  </span>
                  <span>{currentQuestion.answers.D}</span>
                </div>
              </AutoFontSize>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
