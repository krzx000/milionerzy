import { NextResponse } from "next/server";
import { gameSessionDb } from "@/lib/db/game-session";

export async function POST() {
  try {
    const session = await gameSessionDb.previousQuestion();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Nie znaleziono aktywnej sesji lub jesteś na pierwszym pytaniu",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: session,
      message: "Przeszło do poprzedniego pytania",
    });
  } catch (error) {
    console.error("Błąd przejścia do poprzedniego pytania:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Błąd przejścia do poprzedniego pytania",
      },
      { status: 500 }
    );
  }
}
