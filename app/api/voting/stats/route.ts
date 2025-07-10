import { NextResponse } from "next/server";
import { VoteStats, VoteResult, VoteOption } from "@/types/voting";
import { getCurrentVoteSession, getVotes } from "@/lib/voting/session-manager";

export async function GET() {
  try {
    const currentVoteSession = getCurrentVoteSession();
    if (!currentVoteSession) {
      // Zwróć pustą statystykę zamiast błędu
      return NextResponse.json({
        totalVotes: 0,
        results: {
          A: { option: "A", count: 0, percentage: 0 },
          B: { option: "B", count: 0, percentage: 0 },
          C: { option: "C", count: 0, percentage: 0 },
          D: { option: "D", count: 0, percentage: 0 },
        },
      });
    }

    // Policz głosy dla każdej opcji
    const voteCounts: Record<VoteOption, number> = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    };

    const votes = getVotes();
    Object.values(votes).forEach((vote) => {
      voteCounts[vote.option as VoteOption]++;
    });

    const totalVotes = Object.values(voteCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    // Stwórz statystyki
    const results: Record<VoteOption, VoteResult> = {
      A: {
        option: "A",
        count: voteCounts.A,
        percentage:
          totalVotes > 0 ? Math.round((voteCounts.A / totalVotes) * 100) : 0,
      },
      B: {
        option: "B",
        count: voteCounts.B,
        percentage:
          totalVotes > 0 ? Math.round((voteCounts.B / totalVotes) * 100) : 0,
      },
      C: {
        option: "C",
        count: voteCounts.C,
        percentage:
          totalVotes > 0 ? Math.round((voteCounts.C / totalVotes) * 100) : 0,
      },
      D: {
        option: "D",
        count: voteCounts.D,
        percentage:
          totalVotes > 0 ? Math.round((voteCounts.D / totalVotes) * 100) : 0,
      },
    };

    const stats: VoteStats = {
      totalVotes,
      results,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Błąd pobierania statystyk głosowania:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
