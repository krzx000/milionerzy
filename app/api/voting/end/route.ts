import { NextResponse } from "next/server";
import { getCurrentVoteSession, getVotes } from "@/lib/voting/session-manager";
import { broadcastEvent } from "@/lib/sse/manager";

export async function POST() {
  try {
    const currentVoteSession = getCurrentVoteSession();
    if (!currentVoteSession) {
      return NextResponse.json(
        { error: "Brak sesji głosowania" },
        { status: 400 }
      );
    }

    // Zakończ głosowanie
    currentVoteSession.isActive = false;
    currentVoteSession.endTime = new Date();

    console.log(`Zakończono głosowanie: ${currentVoteSession.id}`);

    const votes = getVotes();

    // Policz wyniki głosowania
    const voteCounts: Record<string, number> = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    };

    Object.values(votes).forEach((vote) => {
      if (vote.option in voteCounts) {
        voteCounts[vote.option]++;
      }
    });

    const totalVotes = Object.values(voteCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    // Oblicz procenty
    const results: Record<string, number> = {};
    Object.entries(voteCounts).forEach(([option, count]) => {
      results[option] =
        totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
    });

    // SSE: Powiadom o ręcznym zakończeniu głosowania z wynikami
    broadcastEvent("voting-ended", {
      voteSessionId: currentVoteSession.id,
      endTime: currentVoteSession.endTime,
      totalVotes,
      results, // Dodajemy wyniki głosowania
      reason: "manual", // Ręcznie zakończone przez admina
    });

    return NextResponse.json({
      success: true,
      data: { endTime: currentVoteSession.endTime },
    });
  } catch (error) {
    console.error("Błąd kończenia głosowania:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
