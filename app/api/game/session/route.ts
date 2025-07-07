import { NextResponse } from "next/server";
import { gameSessionDb } from "@/lib/db/game-session";
import { questionsDb } from "@/lib/db/questions";

// GET /api/game/session - pobierz aktualną sesję gry
export async function GET() {
  try {
    const session = await gameSessionDb.getCurrent();

    if (!session) {
      return NextResponse.json({
        success: true,
        data: null,
        message: "Brak aktywnej sesji gry",
      });
    }

    // Dodaj informacje o aktualnym pytaniu
    const questions = await questionsDb.getAll();
    const currentQuestion = questions[session.currentQuestionIndex] || null;

    const prizes = [
      "500 zł",
      "1 000 zł",
      "2 000 zł",
      "5 000 zł",
      "10 000 zł",
      "20 000 zł",
      "40 000 zł",
      "75 000 zł",
      "125 000 zł",
      "250 000 zł",
      "500 000 zł",
      "1 000 000 zł",
    ];
    const currentPrize =
      prizes[Math.min(session.currentQuestionIndex, prizes.length - 1)] ||
      "0 zł";

    return NextResponse.json({
      success: true,
      data: {
        ...session,
        currentQuestion,
        currentPrize,
        totalQuestions: questions.length,
      },
    });
  } catch (error) {
    console.error("Error fetching game session:", error);
    return NextResponse.json(
      { success: false, error: "Błąd pobierania sesji gry" },
      { status: 500 }
    );
  }
}
