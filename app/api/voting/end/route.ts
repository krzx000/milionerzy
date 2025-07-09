import { NextResponse } from "next/server";
import { currentVoteSession } from "../start/route";

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

    return NextResponse.json({
      success: true,
      data: { endTime: currentVoteSession.endTime },
    });
  } catch (error) {
    console.error("Błąd kończenia głosowania:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
