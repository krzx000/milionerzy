import { NextRequest, NextResponse } from "next/server";
import { gameSessionDb } from "@/lib/db/game-session";

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

    // Mapowanie nazw kół ratunkowych na przyjazne nazwy
    const lifelineNames = {
      fiftyFifty: "50:50",
      phoneAFriend: "Telefon do przyjaciela",
      askAudience: "Pytanie do publiczności",
    } as const;

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
