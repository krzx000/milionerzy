"use client";

import * as React from "react";
import { IMAGES } from "@/lib/utils/game-assets";
import type { Question } from "@/types/question";

interface AudienceVotingDisplayProps {
  isActive: boolean;
  showResults: boolean;
  results: Record<string, number> | null;
  currentQuestion: Question | null;
  hiddenAnswers: string[];
}

interface BarProps {
  label: string;
  answer: string;
  percentage: number;
  isAnimating: boolean;
  isHidden: boolean;
  color: string;
}

function VotingBar({
  label,
  answer,
  percentage,
  isAnimating,
  isHidden,
  color,
}: BarProps) {
  const [currentPercentage, setCurrentPercentage] = React.useState(0);

  React.useEffect(() => {
    if (isAnimating && !isHidden) {
      // Animacja słupka podczas głosowania (losowe wartości z płynnym przejściem)
      const interval = setInterval(() => {
        setCurrentPercentage(Math.random() * 60 + 10); // 10-70%
      }, 400);

      return () => clearInterval(interval);
    } else if (!isAnimating && !isHidden) {
      // Pokaż rzeczywisty wynik z opóźnieniem dla efektu dramatycznego
      const timeout = setTimeout(() => {
        setCurrentPercentage(percentage);
      }, 500);

      return () => clearTimeout(timeout);
    } else {
      // Reset dla ukrytych odpowiedzi
      setCurrentPercentage(0);
    }
  }, [isAnimating, percentage, isHidden]);

  if (isHidden) return null;

  return (
    <div className="mb-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:bg-white/15 hover:border-white/40 transition-all duration-300">
      <div className="flex items-center mb-2">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${color} mr-4 shadow-lg border border-white/30`}
        >
          {label}
        </div>
        <div className="flex-1">
          <div className="text-white text-lg font-medium mb-1 truncate drop-shadow-md">
            {answer}
          </div>
          <div className="relative h-8 bg-black/40 backdrop-blur-sm rounded-full overflow-hidden border border-white/20 shadow-inner">
            <div
              className={`absolute top-0 left-0 h-full ${color} transition-all duration-700 ease-out flex items-center justify-end pr-3 shadow-lg ${
                isAnimating ? "animate-pulse" : ""
              }`}
              style={{ width: `${currentPercentage}%` }}
            >
              {!isAnimating && currentPercentage > 15 && (
                <span className="text-white font-bold text-sm drop-shadow-md">
                  {Math.round(currentPercentage)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AudienceVotingDisplay({
  isActive,
  showResults,
  results,
  currentQuestion,
  hiddenAnswers,
}: AudienceVotingDisplayProps) {
  const isVisible = isActive || showResults;

  if (!isVisible || !currentQuestion) return null;

  const answerColors = {
    A: "bg-blue-500",
    B: "bg-green-500",
    C: "bg-yellow-500",
    D: "bg-red-500",
  };

  // Oblicz procenty dla każdej odpowiedzi
  const totalVotes = results
    ? Object.values(results).reduce((sum, count) => sum + count, 0)
    : 0;
  const percentages = results
    ? Object.fromEntries(
        Object.entries(results).map(([key, count]) => [
          key,
          totalVotes > 0 ? (count / totalVotes) * 100 : 0,
        ])
      )
    : {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop z efektem glassmorphism */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${IMAGES.BACKGROUND})` }}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Główny panel głosowania */}
      <div className="relative w-full max-w-4xl mx-8 bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl p-8 shadow-2xl hover:shadow-2xl transition-all duration-500 hover:bg-white/25">
        {/* Gradient overlay dla dodatkowego efektu */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none" />
        {/* Nagłówek */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/80 to-orange-500/80 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-lg border border-white/20">
              <span className="text-2xl">👥</span>
            </div>
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              {isActive && !showResults
                ? "Trwa głosowanie publiczności..."
                : "Wyniki głosowania publiczności"}
            </h2>
          </div>

          {isActive && !showResults && (
            <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div
                className="w-4 h-4 bg-blue-400/80 rounded-full animate-bounce shadow-lg"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-4 h-4 bg-green-400/80 rounded-full animate-bounce shadow-lg"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-4 h-4 bg-yellow-400/80 rounded-full animate-bounce shadow-lg"
                style={{ animationDelay: "300ms" }}
              />
              <div
                className="w-4 h-4 bg-red-400/80 rounded-full animate-bounce shadow-lg"
                style={{ animationDelay: "450ms" }}
              />
            </div>
          )}
        </div>

        {/* Pytanie */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/30 shadow-lg">
          <p className="text-white text-xl text-center font-medium drop-shadow-md">
            {currentQuestion.content}
          </p>
        </div>

        {/* Słupki wyników */}
        <div className="space-y-4">
          {Object.entries(currentQuestion.answers).map(
            ([key, answer], index) => (
              <div
                key={key}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <VotingBar
                  label={key}
                  answer={answer}
                  percentage={percentages[key] || 0}
                  isAnimating={isActive && !showResults}
                  isHidden={hiddenAnswers.includes(key)}
                  color={answerColors[key as keyof typeof answerColors]}
                />
              </div>
            )
          )}
        </div>

        {/* Informacja o łącznej liczbie głosów */}
        {showResults && totalVotes > 0 && (
          <div className="text-center mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
            <p className="text-white/90 text-lg">
              Łączna liczba głosów:{" "}
              <span className="font-bold text-white drop-shadow-md">
                {totalVotes}
              </span>
            </p>
          </div>
        )}

        {/* Animowany pasek postępu podczas głosowania */}
        {isActive && !showResults && (
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="w-full h-3 bg-black/40 backdrop-blur-sm rounded-full overflow-hidden border border-white/20">
              <div className="h-full bg-gradient-to-r from-blue-500 to-red-500 rounded-full animate-pulse shadow-lg" />
            </div>
            <p className="text-center text-white/90 mt-3 text-sm font-medium drop-shadow-md">
              Zbieranie głosów...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
