import { NextResponse } from "next/server";
import { currentVoteSession, votes } from "../start/route";
import { broadcastEvent } from "@/lib/sse/manager";

export async function POST() {
  try {
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

    // 🔥 SSE: Powiadom o ręcznym zakończeniu głosowania
    broadcastEvent("voting-ended", {
      voteSessionId: currentVoteSession.id,
      endTime: currentVoteSession.endTime,
      totalVotes: Object.keys(votes).length,
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
