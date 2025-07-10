import { Wifi, WifiOff } from "lucide-react";
import type { GameViewerState } from "@/lib/api/voting";
import type { VoteSession } from "@/types/voting";

interface VoteFooterProps {
  gameState?: GameViewerState | null;
  voteSession?: VoteSession | null;
  isConnected: boolean;
}

export function VoteFooter({
  gameState,
  voteSession,
  isConnected,
}: VoteFooterProps) {
  // Footer jest widoczny tylko gdy jest aktywna gra lub sesja głosowania
  if (!gameState && !voteSession) return null;

  return (
    <div className="fixed bottom-2 left-2 right-2 z-10">
      <div className="max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Progres pytań */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center">
                <span className="text-xs font-semibold text-blue-600">#</span>
              </div>
              <div className="text-xs">
                <span className="font-semibold text-gray-800">
                  {(gameState?.gameSession?.currentQuestionIndex ?? 0) + 1}
                </span>
                <span className="text-gray-500 mx-1">/</span>
                <span className="text-gray-600">
                  {gameState?.gameSession?.totalQuestions || 12}
                </span>
              </div>
            </div>

            {/* Progres bar */}
            <div className="flex-1 mx-3">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{
                    width: `${
                      (((gameState?.gameSession?.currentQuestionIndex ?? 0) +
                        1) /
                        (gameState?.gameSession?.totalQuestions || 12)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Status połączenia */}
            <div className="flex items-center gap-2">
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center ${
                  isConnected ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {isConnected ? (
                  <Wifi className="w-3 h-3 text-green-600" />
                ) : (
                  <WifiOff className="w-3 h-3 text-red-600" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
