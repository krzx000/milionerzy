import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import type { VoteOption, VoteStats } from "@/types/voting";

interface VotingResultsCardProps {
  stats: VoteStats;
  userVote: VoteOption | null;
}

export function VotingResultsCard({ stats, userVote }: VotingResultsCardProps) {
  return (
    <div className="px-4 pb-4">
      <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800">
            <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            Wyniki Głosowania
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4 bg-purple-50 rounded-xl p-3">
            <p className="text-lg font-semibold text-gray-800">
              Łącznie głosów: {stats.totalVotes}
            </p>
          </div>

          <div className="space-y-3">
            {(["A", "B", "C", "D"] as VoteOption[]).map((option, index) => {
              const result = stats.results[option];
              const isUserVote = userVote === option;

              const colors = [
                "bg-blue-600",
                "bg-orange-500",
                "bg-purple-600",
                "bg-teal-600",
              ];

              return (
                <div
                  key={option}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 ${
                    isUserVote
                      ? "bg-yellow-50 border-yellow-400"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-white text-sm ${colors[index]}`}
                    >
                      {option}
                    </div>
                    <span className="font-semibold text-base text-gray-800">
                      {result.percentage}%
                    </span>
                    {isUserVote && <span className="text-lg">👆</span>}
                  </div>
                  <span className="font-medium text-gray-600 text-sm">
                    ({result.count} głosów)
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
