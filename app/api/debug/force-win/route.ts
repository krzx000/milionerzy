import { NextResponse } from "next/server";
import { gameSessionDb } from "@/lib/db/game-session";
import { prisma } from "@/lib/db/prisma";
import { sseManager } from "@/lib/sse/manager";

export async function POST() {
  try {
    // Pobierz aktywną sesję
    const session = await gameSessionDb.getCurrent();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Brak aktywnej sesji gry" },
        { status: 404 }
      );
    }

    // Pobierz pytania sesji (aby mieć ID ostatniego pytania)
    const sessionQuestions = await prisma.gameSessionQuestion.findMany({
      where: { gameSessionId: session.id },
      orderBy: { order: "asc" },
      include: { question: true },
    });

    const totalQuestions = session.totalQuestions || sessionQuestions.length;
    const lastIndex = Math.max(0, totalQuestions - 1);
    const lastQuestion = sessionQuestions[lastIndex]?.question;

    // Zakończ grę jako wygraną
    const finished = await gameSessionDb.finishGame(true);

    // Wyemituj zdarzenie ujawnienia odpowiedzi dla ostatniego pytania
    sseManager.broadcast(
      "answer-revealed",
      {
        selectedAnswer: "A",
        correctAnswer: "A",
        isCorrect: true,
        questionIndex: lastIndex,
        questionId: lastQuestion?.id || "",
        gameWon: true,
      },
      "all"
    );

    // Potem emituj game-ended (kanoniczny finalQuestionIndex z finished)
    sseManager.broadcast(
      "game-ended",
      {
        reason: "completed",
        result: "win",
        finalQuestionIndex: finished?.currentQuestionIndex ?? totalQuestions,
        timestamp: new Date(),
      },
      "all"
    );

    return NextResponse.json({ success: true, data: finished });
  } catch (error) {
    console.error("DEBUG force-win error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
