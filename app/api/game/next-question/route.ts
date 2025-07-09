import { NextResponse } from "next/server";
import { gameSessionDb } from "@/lib/db/game-session";
import { clearVotingSession } from "../../voting/start/route";

export async function POST() {
  try {
    const session = await gameSessionDb.nextQuestion();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Nie znaleziono aktywnej sesji lub osiągnięto koniec pytań",
        },
        { status: 404 }
      );
    }

    // Wyczyść sesję głosowania przy przejściu do kolejnego pytania
    clearVotingSession();

    return NextResponse.json({
      success: true,
      data: session,
      message: "Przeszło do następnego pytania",
    });
  } catch (error) {
    console.error("Błąd przejścia do następnego pytania:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Błąd przejścia do następnego pytania",
      },
      { status: 500 }
    );
  }
}
