import { NextResponse } from "next/server";
import { gameSessionDb } from "@/lib/db/game-session";

export async function POST() {
  try {
    // Użyj metody stopGame aby zatrzymać grę
    const session = await gameSessionDb.stopGame();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Nie znaleziono aktywnej sesji gry",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: session,
      message: "Gra została zatrzymana",
    });
  } catch (error) {
    console.error("Błąd zatrzymania gry:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Błąd zatrzymania gry",
      },
      { status: 500 }
    );
  }
}
