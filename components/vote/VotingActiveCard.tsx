import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Users } from "lucide-react";
import type { VoteOption, VoteSession } from "@/types/voting";
import { GAME_CONSTANTS } from "@/lib/constants/game";

interface VotingActiveCardProps {
  voteSession: VoteSession;
  timeRemaining: number;
  userVote: VoteOption | null;
}

export function VotingActiveCard({
  voteSession,
  timeRemaining,
  userVote,
}: VotingActiveCardProps) {
  if (!voteSession.isActive || timeRemaining <= 0) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="px-4 pb-4">
      <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800">
            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-green-600" />
            </div>
            Głosowanie Aktywne!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="bg-green-50 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <span className="text-base font-semibold text-gray-800">
                    Pozostały czas
                  </span>
                </div>
                <span className="text-xl font-semibold text-green-700">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <Progress
                value={(timeRemaining / GAME_CONSTANTS.VOTING_TIME_LIMIT) * 100}
                className="h-2 mt-2"
              />
            </div>

            <div
              className={`p-3 rounded-xl border-2 ${
                userVote
                  ? "bg-blue-50 border-blue-400"
                  : "bg-yellow-50 border-yellow-400"
              }`}
            >
              {userVote ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✅</span>
                    <span className="text-base font-semibold text-gray-800">
                      Głos oddany!
                    </span>
                  </div>
                  <div className="px-2 py-1 rounded-md bg-blue-50 border border-blue-200">
                    <span className="text-xs font-medium text-blue-700">
                      Twój głos: {userVote}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-base font-semibold text-gray-800 mb-1">
                    ⏰ Czas na głosowanie!
                  </p>
                  <p className="text-sm text-gray-600">
                    👆 Wybierz odpowiedź powyżej
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
