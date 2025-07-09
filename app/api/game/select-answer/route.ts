import { NextRequest, NextResponse } from "next/server";
import { gameSessionDb } from "@/lib/db/game-session";
import { sseManager } from "@/lib/sse/manager";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answer } = body;

    if (
      !answer ||
      typeof answer !== "string" ||
      !["A", "B", "C", "D"].includes(answer)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Nieprawidłowa odpowiedź",
        },
        { status: 400 }
      );
    }

    // Pobierz aktualną sesję
    const session = await gameSessionDb.getCurrent();
    if (!session || session.status !== "active") {
      return NextResponse.json(
        {
          success: false,
          error: "Nie znaleziono aktywnej sesji",
        },
        { status: 404 }
      );
    }

    // Pobierz aktualne pytanie z sesji
    const { prisma } = await import("@/lib/db/prisma");
    const sessionQuestions = await prisma.gameSessionQuestion.findMany({
      where: { gameSessionId: session.id },
      orderBy: { order: "asc" },
      include: { question: true },
    });

    const currentQuestion =
      sessionQuestions[session.currentQuestionIndex]?.question;

    if (!currentQuestion) {
      return NextResponse.json(
        {
          success: false,
          error: "Nie znaleziono aktualnego pytania",
        },
        { status: 404 }
      );
    }

    // Broadcast SSE event o wyborze odpowiedzi
    sseManager.broadcast(
      "answer-selected",
      {
        selectedAnswer: answer,
        questionIndex: session.currentQuestionIndex,
        questionId: currentQuestion.id,
      },
      "all"
    );

    return NextResponse.json({
      success: true,
      data: {
        selectedAnswer: answer,
        questionIndex: session.currentQuestionIndex,
        questionId: currentQuestion.id,
      },
      message: `Wybrano odpowiedź: ${answer}`,
    });
  } catch (error) {
    console.error("Błąd wybierania odpowiedzi:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Błąd wybierania odpowiedzi",
      },
      { status: 500 }
    );
  }
}
