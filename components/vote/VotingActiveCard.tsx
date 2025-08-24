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
      <Card className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
            <div className="w-6 h-6 bg-green-100/30 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-green-200" />
            </div>
            Głosowanie Aktywne!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-600/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <span className="text-base font-semibold text-white">
                    Pozostały czas
                  </span>
                </div>
                <span className="text-xl font-semibold text-green-200">
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
                  ? "bg-blue-500/30 backdrop-blur-sm border-blue-300/50"
                  : "bg-yellow-500/30 backdrop-blur-sm border-yellow-300/50"
              }`}
            >
              {userVote ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✅</span>
                    <span className="text-base font-semibold text-white">
                      Głos oddany!
                    </span>
                  </div>
                  <div className="px-2 py-1 rounded-md bg-blue-500/30 backdrop-blur-sm border border-blue-400/50">
                    <span className="text-xs font-medium text-blue-200">
                      Twój głos: {userVote}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-base font-semibold text-white mb-1">
                    ⏰ Czas na głosowanie!
                  </p>
                  <p className="text-sm text-white/80">
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
