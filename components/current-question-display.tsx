"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Question as QuestionType } from "@/types/question";
import { GameSessionWithQuestions } from "@/lib/db/game-session";
import { getCurrentPrize } from "@/lib/utils/prize";
import { GAME_CONSTANTS } from "@/lib/constants/game";

interface CurrentQuestionDisplayProps {
  gameSession: GameSessionWithQuestions | null;
  currentQuestion: QuestionType | null;
  questionsCount: number;
  selectedAnswer: string | null;
  isAnswerRevealed: boolean;
  gameLoading: boolean;
  lastAnswerResult: {
    correct: boolean;
    gameWon: boolean;
    correctAnswer?: string;
  } | null;
  gameEndReason: "wrong_answer" | "game_won" | null;
  onSelectAnswer: (answer: string) => void;
  onConfirmAnswer: () => void;
  onCancelAnswer: () => void;
}

export function CurrentQuestionDisplay({
  gameSession,
  currentQuestion,
  questionsCount,
  selectedAnswer,
  isAnswerRevealed,
  gameLoading,
  lastAnswerResult,
  gameEndReason,
  onSelectAnswer,
  onConfirmAnswer,
  onCancelAnswer,
}: CurrentQuestionDisplayProps) {
  const isGameActive = gameSession?.status === "active";
  const isGameEnded = gameSession?.status === "finished";
  const currentQuestionIndex = gameSession?.currentQuestionIndex || 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          {isGameActive
            ? "Aktualne pytanie"
            : isGameEnded
            ? "Status gry"
            : "Aktualne pytanie"}
        </CardTitle>
        <CardDescription>
          {isGameActive
            ? `Pytanie ${Math.min(
                currentQuestionIndex + 1,
                questionsCount
              )} z ${questionsCount}`
            : isGameEnded
            ? `Pytanie ${Math.min(
                currentQuestionIndex + 1,
                questionsCount
              )} z ${questionsCount}`
            : "Brak aktywnej gry"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pokazuj pytanie tylko gdy gra jest aktywna */}
        {isGameActive && currentQuestion ? (
          <>
            {/* Treść pytania */}
            <div className="p-4 bg-blue-500/20  border-blue-500/40  rounded-lg border">
              <h3 className="text-lg font-semibold dark:text-blue-200 text-blue-700 mb-2">
                Pytanie za {getCurrentPrize(currentQuestionIndex)}
              </h3>
              <p className="dark:text-blue-400 text-blue-600 leading-relaxed break-words">
                {currentQuestion.content}
              </p>
            </div>

            {/* Odpowiedzi */}
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(currentQuestion.answers).map(([key, value]) => {
                const isSelected = selectedAnswer === key;
                const isCorrect =
                  isAnswerRevealed &&
                  lastAnswerResult &&
                  key === lastAnswerResult.correctAnswer;
                const isWrong =
                  isAnswerRevealed &&
                  isSelected &&
                  lastAnswerResult &&
                  key !== lastAnswerResult.correctAnswer;

                let variant:
                  | "default"
                  | "secondary"
                  | "destructive"
                  | "outline" = "outline";
                let className =
                  "justify-start text-left h-auto py-3 px-4 whitespace-normal break-words min-h-[3rem]";

                if (isCorrect) {
                  variant = "default";
                  className +=
                    " bg-green-100 border-green-500 text-green-800 hover:bg-green-100";
                } else if (isWrong) {
                  variant = "destructive";
                  className += " bg-red-100 border-red-500 text-red-800";
                } else if (isSelected) {
                  variant = "secondary";
                  className +=
                    "bg-blue-600/20 dark:bg-blue-500/20 border border-blue-500/40 dark:text-blue-200 text-blue-600";
                }

                return (
                  <Button
                    key={key}
                    variant={variant}
                    className={className}
                    disabled={
                      gameLoading ||
                      isAnswerRevealed ||
                      isGameEnded ||
                      lastAnswerResult?.gameWon
                    }
                    onClick={() => onSelectAnswer(key)}
                  >
                    <span className="font-bold mr-3 flex-shrink-0">{key}:</span>
                    <span className="flex-1 break-words leading-relaxed">
                      {value}
                    </span>
                    {isCorrect && <span className="ml-2 flex-shrink-0">✓</span>}
                    {isWrong && <span className="ml-2 flex-shrink-0">✗</span>}
                  </Button>
                );
              })}
            </div>

            {/* Przycisk potwierdzający odpowiedź */}
            {selectedAnswer &&
              !isAnswerRevealed &&
              !gameLoading &&
              !isGameEnded &&
              !lastAnswerResult?.gameWon && (
                <div className="text-center space-y-3">
                  <div className="flex flex-col xl:flex-row gap-2 w-full">
                    <Button
                      onClick={onConfirmAnswer}
                      className="!bg-green-600 !hover:bg-green-700 text-white flex-1 px-4 py-3 text-lg font-semibold"
                      size="lg"
                    >
                      ✅ Potwierdź odpowiedź
                    </Button>
                    <Button
                      onClick={onCancelAnswer}
                      variant="destructive"
                      className="flex-1 px-4 py-3 text-lg"
                      size="lg"
                    >
                      ❌ Anuluj
                    </Button>
                  </div>
                </div>
              )}

            {/* Status */}
            {gameLoading && (
              <div className="text-center text-sm text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 inline-block mr-2"></div>
                Przetwarzanie odpowiedzi...
              </div>
            )}

            {isAnswerRevealed && !gameLoading && lastAnswerResult && (
              <div className="text-center text-sm text-gray-600 break-words">
                {lastAnswerResult.correct ? (
                  lastAnswerResult.gameWon ? (
                    <span className="text-green-600 font-semibold">
                      Gracz wygrał całą grę!
                    </span>
                  ) : (
                    <span className="text-green-600">
                      Poprawnie! Przejście do następnego pytania za{" "}
                      {GAME_CONSTANTS.AUTO_PROGRESS_TIME}s...
                    </span>
                  )
                ) : (
                  <span className="text-red-600">
                    Niepoprawna odpowiedź! Gra zakończona. Prowadzący może
                    zamknąć sesję.
                  </span>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500 py-8">
            {isGameEnded ? (
              <div className="space-y-4">
                {/* Sprawdź powód zakończenia gry */}
                {gameEndReason === "wrong_answer" ? (
                  // Przegrana gra
                  <>
                    <div className="text-red-600 font-semibold text-lg">
                      Gra zakończona
                    </div>
                    <div className="text-gray-700">Niepoprawna odpowiedź!</div>
                    <div className="p-4 bg-yellow-500/10 border border-yellow-300/80 rounded-lg">
                      <div className="text-sm text-yellow-700 mb-1">
                        Wygrana kwota:
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {currentQuestionIndex === 0
                          ? "0 zł"
                          : getCurrentPrize(currentQuestionIndex - 1)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Prowadzący może zamknąć sesję.
                    </div>
                  </>
                ) : gameEndReason === "game_won" ||
                  (gameSession && currentQuestionIndex >= questionsCount) ? (
                  // Wygrana gra (wykrywana przez gameEndReason lub currentQuestionIndex >= questionsCount)
                  <>
                    <div className="text-green-600 font-semibold text-lg">
                      Gratulacje!
                    </div>
                    <div className="text-gray-500">
                      Gracz odpowiedział poprawnie na wszystkie 12 pytań!
                    </div>
                    <div className="p-4 bg-yellow-500/10 border border-yellow-300/80 rounded-lg">
                      <div className="text-sm text-yellow-700 mb-1">
                        Wygrana kwota:
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">
                        1 000 000 zł
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Prowadzący może zamknąć sesję.
                    </div>
                  </>
                ) : (
                  // Fallback dla starych sesji lub nieznanych stanów - ale teraz sprawdzamy czy to nie przegrana
                  <>
                    <div className="text-red-600 font-semibold text-lg">
                      Gra zakończona
                    </div>
                    <div className="text-gray-700">Niepoprawna odpowiedź!</div>
                    <div className="p-4 bg-yellow-500/10 border border-yellow-300/80 rounded-lg">
                      <div className="text-sm text-yellow-700 mb-1">
                        Wygrana kwota:
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {currentQuestionIndex === 0
                          ? "0 zł"
                          : getCurrentPrize(currentQuestionIndex - 1)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Prowadzący może zamknąć sesję.
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div>
                {isGameActive
                  ? "Ładowanie pytania..."
                  : "Rozpocznij grę aby zobaczyć pytania"}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
