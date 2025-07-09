import { NextResponse } from "next/server";
import { gameSessionDb } from "@/lib/db/game-session";
import { prisma } from "@/lib/db/prisma";
import { currentVoteSession } from "../start/route";

export async function GET() {
  try {
    // Jeśli jest aktywna sesja głosowania, zwróć ją
    if (currentVoteSession) {
      return NextResponse.json({
        success: true,
        data: currentVoteSession,
      });
    }

    // Jeśli nie ma aktywnej sesji głosowania, zwróć podstawowe informacje o grze
    const gameSession = await gameSessionDb.getCurrent();

    if (!gameSession) {
      return NextResponse.json({
        success: true,
        data: null,
        message: "Brak aktywnej gry",
      });
    }

    // Pobierz pytania powiązane z sesją
    const sessionQuestions = await prisma.gameSessionQuestion.findMany({
      where: { gameSessionId: gameSession.id },
      orderBy: { order: "asc" },
      include: { question: true },
    });

    const questions = sessionQuestions.map((q) => ({
      id: q.question.id,
      content: q.question.content,
      answers: {
        A: q.question.answerA,
        B: q.question.answerB,
        C: q.question.answerC,
        D: q.question.answerD,
      },
      correctAnswer: q.question.correctAnswer as "A" | "B" | "C" | "D",
    }));

    const currentQuestion = questions[gameSession.currentQuestionIndex];

    // Sprawdź ukryte odpowiedzi dla 50:50
    const hiddenAnswers =
      gameSession.hiddenAnswers[gameSession.currentQuestionIndex] || [];

    // Zwróć informacje o aktualnym stanie gry (bez aktywnego głosowania)
    return NextResponse.json({
      success: true,
      data: {
        gameSession: {
          id: gameSession.id,
          status: gameSession.status,
          currentQuestionIndex: gameSession.currentQuestionIndex,
          totalQuestions: gameSession.totalQuestions,
          usedLifelines: gameSession.usedLifelines,
          hiddenAnswers: hiddenAnswers, // Dodaj ukryte odpowiedzi
        },
        currentQuestion: currentQuestion || null,
        voteSession: null,
      },
    });
  } catch (error) {
    console.error("Błąd pobierania stanu głosowania:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
