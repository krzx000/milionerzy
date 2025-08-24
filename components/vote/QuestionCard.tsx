import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Check, X } from "lucide-react";
import type { VoteOption, VoteSession, VoteStats } from "@/types/voting";
import type { GameViewerState } from "@/lib/api/voting";
import { useState } from "react";

interface QuestionCardProps {
  gameState?: GameViewerState | null;
  voteSession?: VoteSession | null;
  stats?: VoteStats | null;
  userVote?: VoteOption | null;
  canVote: boolean;
  showResults: boolean;
  selectedAnswer?: string | null;
  correctAnswer?: string | null;
  isAnswerRevealed: boolean;
  onVote: (option: VoteOption) => void;
}

export function QuestionCard({
  gameState,
  voteSession,
  stats,
  userVote,
  canVote,
  showResults,
  selectedAnswer,
  correctAnswer,
  isAnswerRevealed,
  onVote,
}: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<VoteOption | null>(null);
  const question = voteSession?.question || gameState?.currentQuestion;
  const hiddenAnswers =
    voteSession?.hiddenAnswers || gameState?.gameSession?.hiddenAnswers || [];

  const handleConfirmVote = () => {
    if (selectedOption) {
      onVote(selectedOption);
      setSelectedOption(null);
    }
  };

  const handleCancelVote = () => {
    setSelectedOption(null);
  };

  if (!question) return null;

  return (
    <div className="px-4 pb-4">
      <Card className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base font-semibold text-white">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100/30 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <PlayCircle className="w-4 h-4 text-blue-200" />
              </div>
              Pytanie
            </div>
            {hiddenAnswers.length > 0 && (
              <div className="px-2 py-1 rounded-md border-2 bg-red-500/20 backdrop-blur-sm border-red-300/50">
                <span className="text-xs font-medium text-red-200">50:50</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4 bg-yellow-500/20 backdrop-blur-sm rounded-xl p-3">
            <p className="text-lg font-semibold text-white">
              {question.content}
            </p>
          </div>

          <div className="space-y-3">
            {(["A", "B", "C", "D"] as VoteOption[]).map((option, index) => {
              const answerText = question.answers[option];
              const isSelected = userVote === option;
              const isTempSelected = selectedOption === option;
              const canVoteForThis = canVote && !userVote;

              const isHidden = hiddenAnswers.includes(option);
              const isAdminSelected = selectedAnswer === option;
              const isCorrectAnswer = correctAnswer === option;
              const isRevealed = isAnswerRevealed;

              let votePercentage = 0;
              let voteCount = 0;

              if (showResults && stats) {
                votePercentage = stats.results[option]?.percentage || 0;
                voteCount = stats.results[option]?.count || 0;
              }

              const colors = [
                "bg-blue-600",
                "bg-orange-500",
                "bg-purple-600",
                "bg-teal-600",
              ];

              let cardClass = `relative flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 overflow-hidden ${
                canVoteForThis && !isHidden
                  ? "bg-white/10 backdrop-blur-sm border-white/30 hover:border-white/50 hover:bg-white/20 active:scale-95"
                  : isHidden
                  ? "bg-white/5 backdrop-blur-sm border-white/20 opacity-20 cursor-not-allowed pointer-events-none"
                  : "bg-white/10 backdrop-blur-sm border-white/30"
              }`;

              if (isSelected) {
                cardClass = `relative flex items-center justify-between p-3 rounded-xl border-2 bg-blue-500/30 backdrop-blur-sm border-blue-300/50 overflow-hidden`;
              }

              if (isTempSelected) {
                cardClass = `relative flex items-center justify-between p-3 rounded-xl border-2 bg-green-500/30 backdrop-blur-sm border-green-300/50 overflow-hidden`;
              }

              if (isAdminSelected && !isRevealed) {
                cardClass = `relative flex items-center justify-between p-3 rounded-xl border-2 bg-yellow-500/30 backdrop-blur-sm border-yellow-300/50 overflow-hidden`;
              }

              if (isRevealed) {
                if (isCorrectAnswer) {
                  cardClass = `relative flex items-center justify-between p-3 rounded-xl border-2 bg-green-500/30 backdrop-blur-sm border-green-300/50 overflow-hidden`;
                } else if (isAdminSelected) {
                  cardClass = `relative flex items-center justify-between p-3 rounded-xl border-2 bg-red-500/30 backdrop-blur-sm border-red-300/50 overflow-hidden`;
                }
              }

              return (
                <div
                  key={option}
                  className={cardClass}
                  onClick={() =>
                    canVoteForThis && !isHidden && setSelectedOption(option)
                  }
                >
                  {showResults && !isHidden && (
                    <div
                      className="absolute inset-0 bg-blue-400/40 backdrop-blur-sm rounded-xl opacity-60 transition-all duration-500"
                      style={{ width: `${votePercentage}%` }}
                    />
                  )}
                  <div className="flex items-center gap-3 relative z-10">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-white text-sm ${colors[index]}`}
                    >
                      {option}
                    </div>
                    <span className="font-medium text-sm text-white">
                      {answerText}
                    </span>
                    {isAdminSelected && !isRevealed && (
                      <span className="text-lg animate-bounce">👆</span>
                    )}
                    {isRevealed && isCorrectAnswer && (
                      <span className="text-lg overflow-hidden">✅</span>
                    )}
                    {isRevealed && isAdminSelected && !isCorrectAnswer && (
                      <span className="text-lg">❌</span>
                    )}
                  </div>
                  {showResults && !isHidden && (
                    <div className="relative z-10 text-right">
                      <div className="font-semibold text-base text-white">
                        {votePercentage}%
                      </div>
                      <div className="text-xs text-white/80">
                        ({voteCount} głosów)
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Komunikat o tym że użytkownik już głosował w tej sesji */}
          {!canVote && !userVote && !showResults && voteSession?.isActive && (
            <div className="mt-4 p-4 bg-blue-500/20 backdrop-blur-sm border border-blue-300/50 rounded-xl">
              <p className="text-sm text-center text-white">
                📊 Już oddałeś głos w tej grze. Jeden użytkownik może głosować
                tylko raz w każdej sesji gry.
              </p>
            </div>
          )}

          {/* Komunikat o oddanym głosie */}
          {userVote && (
            <div className="mt-4 p-4 bg-green-500/20 backdrop-blur-sm border border-green-300/50 rounded-xl">
              <p className="text-sm text-center text-white">
                ✅ Twój głos na odpowiedź <strong>{userVote}</strong> został
                zapisany!
              </p>
            </div>
          )}

          {/* Przyciski potwierdzenia głosu */}
          {selectedOption && canVote && !userVote && (
            <div className="mt-4 p-4 bg-green-500/20 backdrop-blur-sm border border-green-300/50 rounded-xl">
              <p className="text-sm text-center text-white mb-3">
                Wybrano odpowiedź <strong>{selectedOption}</strong>. Potwierdź
                swój głos:
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleConfirmVote}
                  className="flex-1 bg-green-600/80 backdrop-blur-sm hover:bg-green-700/80 text-white border border-green-400/50"
                  size="sm"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Potwierdź głos
                </Button>
                <Button
                  onClick={handleCancelVote}
                  variant="outline"
                  className="flex-1 bg-red-500/20 backdrop-blur-sm border-red-300/50 text-white hover:bg-red-500/30"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Anuluj
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
