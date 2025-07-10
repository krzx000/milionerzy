import { NextRequest, NextResponse } from "next/server";
import { gameSessionDb } from "@/lib/db/game-session";
import { startVotingSession } from "@/lib/voting/session-manager";
import { sseManager } from "@/lib/sse/manager";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lifeline } = body;

    if (!lifeline || typeof lifeline !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Nieprawidłowe koło ratunkowe",
        },
        { status: 400 }
      );
    }

    // Sprawdź czy koło ratunkowe jest prawidłowe
    const validLifelines = [
      "fiftyFifty",
      "phoneAFriend",
      "askAudience",
    ] as const;
    type ValidLifeline = (typeof validLifelines)[number];

    function isValidLifeline(value: string): value is ValidLifeline {
      return (validLifelines as readonly string[]).includes(value);
    }

    if (!isValidLifeline(lifeline)) {
      return NextResponse.json(
        {
          success: false,
          error: "Nieznane koło ratunkowe",
        },
        { status: 400 }
      );
    }

    const session = await gameSessionDb.useLifeline(lifeline);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Nie znaleziono aktywnej sesji lub koło ratunkowe zostało już użyte",
        },
        { status: 404 }
      );
    }

    // Jeśli użyto koła "pytanie do publiczności", automatycznie uruchom głosowanie
    if (lifeline === "askAudience") {
      try {
        // Uruchom sesję głosowania bezpośrednio
        const voteResult = await startVotingSession(session.id);

        if (voteResult.success) {
          console.log("Głosowanie zostało automatycznie uruchomione");
        } else {
          console.error(
            "Nie udało się uruchomić głosowania:",
            voteResult.error
          );
        }
      } catch (error) {
        console.error("Błąd uruchamiania głosowania:", error);
      }
    }

    // Mapowanie nazw kół ratunkowych na przyjazne nazwy
    const lifelineNames = {
      fiftyFifty: "50:50",
      phoneAFriend: "Telefon do przyjaciela",
      askAudience: "Pytanie do publiczności",
    } as const;

    // Broadcast SSE event o użyciu koła ratunkowego
    sseManager.broadcast(
      "lifeline-used",
      {
        lifeline,
        lifelineName: lifelineNames[lifeline] || lifeline,
        questionIndex: session.currentQuestionIndex,
        usedLifelines: session.usedLifelines,
      },
      "all"
    );

    return NextResponse.json({
      success: true,
      data: session,
      message: `Użyto koła ratunkowego: ${lifelineNames[lifeline] || lifeline}`,
    });
  } catch (error) {
    console.error("Błąd użycia koła ratunkowego:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Błąd użycia koła ratunkowego",
      },
      { status: 500 }
    );
  }
}
