"use client";

import Image from "next/image";
import { Inter, Coiny } from "next/font/google";
import useFitText from "use-fit-text";
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
  isGameStartTransition: boolean;
  isSessionClosedTransition: boolean;
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
  isGameStartTransition,
  isSessionClosedTransition,
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

  // useFitText hooks dla każdej odpowiedzi
  const { fontSize: answerAFontSize, ref: answerARef } = useFitText({
    maxFontSize: 100,
    minFontSize: 10,
  });
  const { fontSize: answerBFontSize, ref: answerBRef } = useFitText({
    maxFontSize: 100,
    minFontSize: 10,
  });
  const { fontSize: answerCFontSize, ref: answerCRef } = useFitText({
    maxFontSize: 100,
    minFontSize: 10,
  });
  const { fontSize: answerDFontSize, ref: answerDRef } = useFitText({
    maxFontSize: 100,
    minFontSize: 10,
  });

  return (
    <div
      className={`-space-y-8 relative transition-all duration-500 ${
        !showGameContent ||
        showWinScreen ||
        isTransitioning ||
        isGameStartTransition ||
        isSessionClosedTransition
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
          <div
            ref={answerARef}
            className="absolute left-[14.5%] top-1/2 -translate-y-1/2 w-[29%] h-[50%] flex items-center"
          >
            <p
              style={{ ...INTER.style, fontSize: answerAFontSize }}
              className="text-white font-bold px-4 text-shadow-bold flex justify-between items-center w-full"
            >
              <span className="font-extrabold">A:</span>
              <span>{currentQuestion.answers.A}</span>
              <span className="invisible">A:</span>
            </p>
          </div>
        )}

        {/* Odpowiedź B */}
        {isAnswerVisible("B") && (
          <div
            ref={answerBRef}
            className="absolute right-[14.5%] top-1/2 -translate-y-1/2 w-[29%] h-[50%] flex items-center"
          >
            <p
              style={{ ...INTER.style, fontSize: answerBFontSize }}
              className="text-white font-bold px-4 text-shadow-bold flex justify-between items-center w-full"
            >
              <span className="font-extrabold">B:</span>
              <span>{currentQuestion.answers.B}</span>
              <span className="invisible">B:</span>
            </p>
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
          <div
            ref={answerCRef}
            className="absolute left-[14.5%] top-1/2 -translate-y-1/2 w-[29%] h-[50%] flex items-center"
          >
            <p
              style={{ ...INTER.style, fontSize: answerCFontSize }}
              className="text-white font-bold px-4 text-shadow-bold flex justify-between items-center w-full"
            >
              <span className="font-extrabold">C:</span>
              <span>{currentQuestion.answers.C}</span>
              <span className="invisible">C:</span>
            </p>
          </div>
        )}

        {/* Odpowiedź D */}
        {isAnswerVisible("D") && (
          <div
            ref={answerDRef}
            className="absolute right-[14.5%] top-1/2 -translate-y-1/2 w-[29%] h-[50%] flex items-center"
          >
            <p
              style={{ ...INTER.style, fontSize: answerDFontSize }}
              className="text-white font-bold px-4 text-shadow-bold flex justify-between items-center w-full"
            >
              <span className="font-extrabold">D:</span>
              <span>{currentQuestion.answers.D}</span>
              <span className="invisible">D:</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
