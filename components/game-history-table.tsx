import * as React from "react";
import { Badge } from "@/components/ui/badge";
import type { GameSessionHistory } from "@/lib/api/game";

interface GameHistoryTableProps {
  gameHistory: GameSessionHistory[];
}

export function GameHistoryTable({ gameHistory }: GameHistoryTableProps) {
  const headers = [
    "Data rozpoczęcia",
    "Czas trwania",
    "Status",
    "Wynik",
    "Pytania",
    "Wygrana",
    "Koła ratunkowe",
  ];

  return (
    <div className="overflow-x-auto">
      <div className="space-y-0">
        {/* Nagłówek tabeli */}
        <div className="grid grid-cols-7 gap-0 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
          {headers.map((header) => (
            <div
              key={header}
              className="text-left p-3 whitespace-nowrap font-medium text-sm"
            >
              {header}
            </div>
          ))}
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
                    {new Date(session.startTime).toLocaleDateString("pl-PL")}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(session.startTime).toLocaleTimeString("pl-PL")}
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
                {session.currentQuestionIndex} / {session.totalQuestions}
              </span>
            </div>
            <div className="p-3 transition-colors duration-150">
              <span className="font-medium text-green-600">
                {session.winnings}
              </span>
            </div>
            <div className="p-3 transition-colors duration-150">
              <div className="flex gap-1">
                {session.usedLifelines.fiftyFifty && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    50:50
                  </span>
                )}
                {session.usedLifelines.phoneAFriend && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    📞
                  </span>
                )}
                {session.usedLifelines.askAudience && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    👥
                  </span>
                )}
                {session.usedLifelinesCount === 0 && (
                  <span className="text-xs text-gray-500">Brak</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
