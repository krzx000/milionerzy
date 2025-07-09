import { NextResponse } from "next/server";
import { gameSessionDb } from "@/lib/db/game-session";
import { questionsDb } from "@/lib/db/questions";
import { sseManager } from "@/lib/sse/manager";

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

    if (questions.length < 12) {
      return NextResponse.json(
        {
          success: false,
          error: `Potrzeba minimum 12 pytań do rozpoczęcia gry. Masz tylko ${questions.length} pytań.`,
        },
        { status: 400 }
      );
    }

    // Losuj 12 pytań z całej bazy używając algorytmu Fisher-Yates
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selected = shuffled.slice(0, 12);
    const questionIds = selected.map((q) => q.id);

    console.log(
      `Wylosowano 12 pytań z ${questions.length} dostępnych:`,
      questionIds
    );

    // Tworzymy sesję i relacje GameSessionQuestion
    const session = await gameSessionDb.startWithQuestions(questionIds);

    // Broadcast SSE event o rozpoczęciu gry
    sseManager.broadcast(
      "question-changed",
      {
        questionIndex: 0,
        totalQuestions: 12,
        gameStarted: true,
      },
      "all"
    );

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
