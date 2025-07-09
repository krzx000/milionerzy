import { gameSessionDb } from "@/lib/db/game-session";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    console.log("API: Masowe usuwanie wszystkich sesji gry");

    const result = await gameSessionDb.clearAllSessions();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Pomyślnie usunięto ${result.deletedCount} sesji`,
        deletedCount: result.deletedCount,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Nie udało się usunąć sesji",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API: Błąd podczas masowego usuwania sesji:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Błąd serwera podczas usuwania sesji",
      },
      { status: 500 }
    );
  }
}
