import { NextResponse } from "next/server";
import { gameSessionDb } from "@/lib/db/game-session";

export async function POST() {
  try {
    console.log("API /api/game/end called");
    const success = await gameSessionDb.closeSession();

    if (!success) {
      console.log("No session found to close");
      return NextResponse.json(
        {
          success: false,
          error: "Nie znaleziono sesji do zamknięcia",
        },
        { status: 404 }
      );
    }

    console.log("Session closed successfully");
    return NextResponse.json({
      success: true,
      data: null,
      message: "Sesja gry została zamknięta",
    });
  } catch (error) {
    console.error("Błąd zamykania sesji gry:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Błąd zamykania sesji gry",
      },
      { status: 500 }
    );
  }
}
