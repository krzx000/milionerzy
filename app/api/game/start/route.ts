import { NextResponse } from "next/server";
import { gameSessionDb } from "@/lib/db/game-session";
import { questionsDb } from "@/lib/db/questions";

// POST /api/game/start - rozpocznij nową grę
export async function POST() {
  try {
    const questions = await questionsDb.getAll();

    if (questions.length === 0) {
      return NextResponse.json(
        { success: false, error: "Nie można rozpocząć gry bez pytań" },
        { status: 400 }
      );
    }

    const session = await gameSessionDb.start(questions.length);

    return NextResponse.json({
      success: true,
      data: session,
      message: "Gra została rozpoczęta",
    });
  } catch (error) {
    console.error("Error starting game:", error);
    return NextResponse.json(
      { success: false, error: "Błąd rozpoczynania gry" },
      { status: 500 }
    );
  }
}
