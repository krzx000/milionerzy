import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, ChevronDown, ChevronUp, Phone, UserCheck } from "lucide-react";
import type { GameViewerState } from "@/lib/api/voting";

interface GameStateCardProps {
  gameState: GameViewerState;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function GameStateCard({
  gameState,
  isCollapsed,
  onToggleCollapse,
}: GameStateCardProps) {
  return (
    <div className="px-4 pb-4">
      <Card className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl gap-0">
        <CardHeader
          className="cursor-pointer transition-colors duration-200 w-full flex items-center"
          onClick={onToggleCollapse}
        >
          <CardTitle className="flex items-center justify-between text-base w-full font-semibold text-white">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100/30 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-blue-200" />
              </div>
              Stan Gry
            </div>
            <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center transition-transform duration-200">
              {isCollapsed ? (
                <ChevronDown className="w-4 h-4 text-white" />
              ) : (
                <ChevronUp className="w-4 h-4 text-white" />
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isCollapsed ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"
          }`}
        >
          <CardContent className="space-y-3 py-6">
            <div className="space-y-3">
              <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        #
                      </span>
                    </div>
                    <span className="text-base font-semibold text-white">
                      Pytanie
                    </span>
                  </div>
                  <span className="text-xl font-semibold text-blue-200">
                    {(gameState.gameSession?.currentQuestionIndex ?? 0) + 1}
                  </span>
                </div>
              </div>
            </div>

            {/* Koła ratunkowe */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="text-center mb-3">
                <span className="text-base font-semibold text-white">
                  Koła Ratunkowe
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg border-2 bg-white/10 backdrop-blur-sm border-white/30">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        ½
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      50:50
                    </span>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      gameState.gameSession?.usedLifelines.fiftyFifty
                        ? "bg-red-500/30 backdrop-blur-sm text-red-200 border border-red-400/50"
                        : "bg-green-500/30 backdrop-blur-sm text-green-200 border border-green-400/50"
                    }`}
                  >
                    <span className="text-xs font-medium">
                      {gameState.gameSession?.usedLifelines.fiftyFifty
                        ? "Użyte"
                        : "Dostępne"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg border-2 bg-white/10 backdrop-blur-sm border-white/30">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-500/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Phone className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white">
                      Telefon
                    </span>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      gameState.gameSession?.usedLifelines.phoneAFriend
                        ? "bg-red-500/30 backdrop-blur-sm text-red-200 border border-red-400/50"
                        : "bg-green-500/30 backdrop-blur-sm text-green-200 border border-green-400/50"
                    }`}
                  >
                    <span className="text-xs font-medium">
                      {gameState.gameSession?.usedLifelines.phoneAFriend
                        ? "Użyte"
                        : "Dostępne"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg border-2 bg-white/10 backdrop-blur-sm border-white/30">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-600/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <UserCheck className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white">
                      Publiczność
                    </span>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      gameState.gameSession?.usedLifelines.askAudience
                        ? "bg-red-500/30 backdrop-blur-sm text-red-200 border border-red-400/50"
                        : "bg-green-500/30 backdrop-blur-sm text-green-200 border border-green-400/50"
                    }`}
                  >
                    <span className="text-xs font-medium">
                      {gameState.gameSession?.usedLifelines.askAudience
                        ? "Użyte"
                        : "Dostępne"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
