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
      <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm gap-0">
        <CardHeader
          className="cursor-pointer transition-colors duration-200 w-full flex items-center"
          onClick={onToggleCollapse}
        >
          <CardTitle className="flex items-center justify-between text-base w-full font-semibold text-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-blue-600" />
              </div>
              Stan Gry
            </div>
            <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center transition-transform duration-200">
              {isCollapsed ? (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronUp className="w-4 h-4 text-gray-600" />
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
              <div className="bg-blue-50 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        #
                      </span>
                    </div>
                    <span className="text-base font-semibold text-gray-800">
                      Pytanie
                    </span>
                  </div>
                  <span className="text-xl font-semibold text-blue-700">
                    {(gameState.gameSession?.currentQuestionIndex ?? 0) + 1}
                  </span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        Σ
                      </span>
                    </div>
                    <span className="text-base font-semibold text-gray-800">
                      Łącznie
                    </span>
                  </div>
                  <span className="text-xl font-semibold text-purple-700">
                    {gameState.gameSession?.totalQuestions}
                  </span>
                </div>
              </div>
            </div>

            {/* Koła ratunkowe */}
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-center mb-3">
                <span className="text-base font-semibold text-gray-800">
                  Koła Ratunkowe
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg border-2 bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        ½
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      50:50
                    </span>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      gameState.gameSession?.usedLifelines.fiftyFifty
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-green-50 text-green-700 border border-green-200"
                    }`}
                  >
                    <span className="text-xs font-medium">
                      {gameState.gameSession?.usedLifelines.fiftyFifty
                        ? "Użyte"
                        : "Dostępne"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg border-2 bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <Phone className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      Telefon
                    </span>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      gameState.gameSession?.usedLifelines.phoneAFriend
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-green-50 text-green-700 border border-green-200"
                    }`}
                  >
                    <span className="text-xs font-medium">
                      {gameState.gameSession?.usedLifelines.phoneAFriend
                        ? "Użyte"
                        : "Dostępne"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg border-2 bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                      <UserCheck className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      Publiczność
                    </span>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      gameState.gameSession?.usedLifelines.askAudience
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-green-50 text-green-700 border border-green-200"
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
