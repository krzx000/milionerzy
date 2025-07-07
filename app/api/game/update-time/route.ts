import { NextRequest, NextResponse } from "next/server";
import { gameSessionDb } from "../../../../lib/db/game-session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameTime } = body;

    if (typeof gameTime !== "number" || gameTime < 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Nieprawidłowy czas gry",
        },
        { status: 400 }
      );
    }

    const session = await gameSessionDb.updateGameTime(gameTime);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Nie znaleziono aktywnej sesji",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: session,
      message: "Czas gry został zaktualizowany",
    });
  } catch (error) {
    console.error("Błąd aktualizacji czasu gry:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Błąd aktualizacji czasu gry",
      },
      { status: 500 }
    );
  }
}
