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
import { GameSessionWithQuestions } from "@/lib/db/game-session";
import { GAME_CONSTANTS } from "@/lib/constants/game";
import { getCurrentPrize, getWinningPrize } from "@/lib/utils/prize";

interface GameManagementProps {
  gameSession: GameSessionWithQuestions | null;
  gameLoading: boolean;
  questionsCount: number;
  onStartGame: () => void;
  onEndGame: () => void;
  onUseLifeline: (
    lifelineType: keyof typeof GAME_CONSTANTS.LIFELINE_NAMES
  ) => void;
}

export function GameManagement({
  gameSession,
  gameLoading,
  questionsCount,
  onStartGame,
  onEndGame,
  onUseLifeline,
}: GameManagementProps) {
  const isGameActive = gameSession?.status === "active";
  const isGameEnded = gameSession?.status === "finished";
  const currentQuestionIndex = gameSession?.currentQuestionIndex || 0;
  const usedLifelines = gameSession?.usedLifelines || {
    fiftyFifty: false,
    phoneAFriend: false,
    askAudience: false,
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Zarządzanie grą</CardTitle>
        <CardDescription>
          {isGameActive
            ? "Gra w toku"
            : isGameEnded
            ? "Gra zakończona - oczekuje na prowadzącego"
            : "Gotowy do rozpoczęcia"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status gry */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Status gry:</div>
          <div
            className={`px-3 py-2 rounded-md text-center ${
              isGameActive
                ? GAME_CONSTANTS.GAME_STATUS_STYLES.active
                : isGameEnded
                ? GAME_CONSTANTS.GAME_STATUS_STYLES.finished
                : GAME_CONSTANTS.GAME_STATUS_STYLES.inactive
            }`}
          >
            {isGameActive
              ? "AKTYWNA"
              : isGameEnded
              ? "ZAKOŃCZONA"
              : "NIEAKTYWNA"}
          </div>
        </div>

        {/* Aktualne pytanie */}
        {(isGameActive || isGameEnded) && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Pytanie:</div>
            <div className="text-center bg-blue-500/20 border border-blue-500/40 dark:text-blue-200 text-blue-600 py-2 rounded-md">
              {Math.min(currentQuestionIndex + 1, questionsCount)} z{" "}
              {questionsCount}
            </div>
          </div>
        )}

        {/* Aktualna nagroda */}
        {(isGameActive || isGameEnded) && (
          <div className="space-y-2">
            <div className="text-sm font-medium">
              {isGameEnded ? "Gracz wygrywa:" : "Aktualna nagroda:"}
            </div>
            <div className=" text-center bg-yellow-500/10 border border-yellow-300/80 dark:border-yellow-200/30 text-yellow-600 dark:text-yellow-200 py-2 rounded-md">
              {isGameEnded
                ? getWinningPrize(currentQuestionIndex)
                : getCurrentPrize(currentQuestionIndex)}
            </div>
          </div>
        )}

        {/* Koła ratunkowe - pokazuj tylko gdy gra jest aktywna i nie jest zakończona */}
        {isGameActive && !isGameEnded && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Koła ratunkowe:</div>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(GAME_CONSTANTS.LIFELINE_NAMES).map(
                ([key, name]) => {
                  const lifelineKey = key as keyof typeof usedLifelines;
                  const isUsed = usedLifelines[lifelineKey];
                  const icon = GAME_CONSTANTS.LIFELINE_ICONS[lifelineKey];

                  return (
                    <Button
                      key={key}
                      variant={isUsed ? "secondary" : "default"}
                      size="sm"
                      disabled={isUsed || gameLoading}
                      onClick={() => onUseLifeline(lifelineKey)}
                      className="text-xs whitespace-normal break-words h-auto py-2"
                    >
                      {isUsed ? (
                        <span className="line-through">
                          {icon} {name}
                        </span>
                      ) : (
                        `${icon} ${name}`
                      )}
                    </Button>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* Przyciski sterowania */}
        <div className="space-y-2 pt-4 border-t">
          {!isGameActive && !isGameEnded ? (
            <Button
              onClick={onStartGame}
              disabled={questionsCount < 12 || gameLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {gameLoading
                ? "⏳ Rozpoczynanie..."
                : questionsCount < 12
                ? `🚫 Potrzeba min. 12 pytań (masz ${questionsCount})`
                : "🎮 Rozpocznij grę"}
            </Button>
          ) : isGameActive ? (
            <div className="space-y-2">
              <div className="text-xs text-center p-2 bg-blue-50 text-blue-700 rounded border">
                Gra w toku. Sesję można zamknąć dopiero po jej zakończeniu.
              </div>
              <div className="text-xs text-gray-500 text-center">
                Gracz wygrywa: {getWinningPrize(currentQuestionIndex)}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                onClick={onEndGame}
                variant="destructive"
                disabled={gameLoading}
                className="w-full"
              >
                {gameLoading ? "⏳ Zamykanie sesji..." : "🛑 Zamknij sesję"}
              </Button>

              <div className="text-xs text-center p-2 dark:bg-blue-50/30 border dark:border-blue-50/40 dark:text-blue-200 bg-blue-50 rounded-md">
                Gra zakończona. Kliknij &quot;Zamknij sesję&quot; aby zakończyć
                sesję.
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
