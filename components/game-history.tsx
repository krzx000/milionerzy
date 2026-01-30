"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GameSessionHistory } from "@/lib/api/game";
import { GAME_CONSTANTS } from "@/lib/constants/game";

interface GameHistoryProps {
  gameHistory: GameSessionHistory[];
  historyLoading: boolean;
  isHistoryVisible: boolean;
  onToggleHistory: () => void;
  onClearAllSessions?: () => void;
}

export function GameHistory({
  gameHistory,
  historyLoading,
  isHistoryVisible,
  onToggleHistory,
  onClearAllSessions,
}: GameHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="flex-1">
            <CardTitle>Historia sesji gry</CardTitle>
            <CardDescription>
              Poprzednie sesje gry z wynikami i statystykami
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 lg:shrink-0">
            {onClearAllSessions && gameHistory.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onClearAllSessions}
                disabled={historyLoading}
                className="flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                🗑️ Usuń wszystkie sesje
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleHistory}
              className="flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {isHistoryVisible ? "Ukryj historię" : "Pokaż historię"}
              <svg
                className={`w-4 h-4 transition-transform ${
                  isHistoryVisible ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>
          </div>
        </div>
      </CardHeader>
      {isHistoryVisible && (
        <CardContent>
          {historyLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Ładowanie historii...</span>
            </div>
          ) : gameHistory.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Brak poprzednich sesji gry
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6">
              <div className="space-y-0 min-w-200">
                {/* Nagłówek tabeli */}
                <div className="grid grid-cols-7 gap-0 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                  <div className="text-left p-3 whitespace-nowrap font-medium text-sm">
                    Data rozpoczęcia
                  </div>
                  <div className="text-left p-3 whitespace-nowrap font-medium text-sm">
                    Czas trwania
                  </div>
                  <div className="text-left p-3 whitespace-nowrap font-medium text-sm">
                    Status
                  </div>
                  <div className="text-left p-3 whitespace-nowrap font-medium text-sm">
                    Wynik
                  </div>
                  <div className="text-left p-3 whitespace-nowrap font-medium text-sm">
                    Pytania
                  </div>
                  <div className="text-left p-3 whitespace-nowrap font-medium text-sm">
                    Wygrana
                  </div>
                  <div className="text-left p-3 whitespace-nowrap font-medium text-sm">
                    Koła ratunkowe
                  </div>
                </div>

                {/* Wiersze danych */}
                {gameHistory.map((session) => (
                  <div
                    key={session.id}
                    className="grid grid-cols-7 gap-0 border-b border-gray-200 dark:border-gray-700 group transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="p-3 transition-colors duration-150">
                      {session.startTime ? (
                        <div>
                          <div className="font-medium">
                            {new Date(session.startTime).toLocaleDateString(
                              "pl-PL"
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(session.startTime).toLocaleTimeString(
                              "pl-PL"
                            )}
                          </div>
                        </div>
                      ) : (
                        "—"
                      )}
                    </div>
                    <div className="p-3 transition-colors duration-150">
                      {session.duration > 0 ? (
                        <span>
                          {Math.floor(session.duration / 60)}:
                          {(session.duration % 60).toString().padStart(2, "0")}
                        </span>
                      ) : (
                        "—"
                      )}
                    </div>
                    <div className="p-3 transition-colors duration-150">
                      <Badge
                        variant={
                          session.status === "finished"
                            ? "destructive"
                            : session.status === "active"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {session.status === "finished"
                          ? "Zakończona"
                          : session.status === "active"
                          ? "Aktywna"
                          : "Nieaktywna"}
                      </Badge>
                    </div>
                    <div className="p-3 transition-colors duration-150">
                      <div
                        className={`font-medium ${
                          session.gameWon
                            ? "text-green-600"
                            : session.currentQuestionIndex > 0
                            ? "text-orange-600"
                            : "text-red-600"
                        }`}
                      >
                        {session.result}
                      </div>
                    </div>
                    <div className="p-3 transition-colors duration-150">
                      <span className="text-sm">
                        {session.currentQuestionIndex} /{" "}
                        {session.totalQuestions}
                      </span>
                    </div>
                    <div className="p-3 transition-colors duration-150">
                      <span
                        className={`font-medium ${
                          session.gameWon
                            ? "text-green-600"
                            : session.currentQuestionIndex > 0
                            ? "text-orange-600"
                            : "text-red-600"
                        }`}
                      >
                        {session.winnings}
                      </span>
                    </div>
                    <div className="p-3 transition-colors duration-150">
                      <div className="flex gap-1">
                        {session.usedLifelines.fiftyFifty && (
                          <Badge variant="outline">
                            {GAME_CONSTANTS.LIFELINE_ICONS.fiftyFifty}
                          </Badge>
                        )}
                        {session.usedLifelines.phoneAFriend && (
                          <Badge variant="outline">
                            {GAME_CONSTANTS.LIFELINE_ICONS.phoneAFriend}
                          </Badge>
                        )}
                        {session.usedLifelines.askAudience && (
                          <Badge variant="outline">
                            {GAME_CONSTANTS.LIFELINE_ICONS.askAudience}
                          </Badge>
                        )}
                        {session.usedLifelinesCount === 0 && (
                          <span className="text-xs text-gray-500">
                            Nie wykorzystano
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
