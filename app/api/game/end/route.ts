import { NextResponse } from "next/server";
import { gameSessionDb } from "@/lib/db/game-session";

export async function POST() {
  try {
    const session = await gameSessionDb.end();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Nie znaleziono aktywnej sesji do zakończenia",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: session,
      message: "Gra została zakończona",
    });
  } catch (error) {
    console.error("Błąd zakończenia gry:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Błąd zakończenia gry",
      },
      { status: 500 }
    );
  }
}
