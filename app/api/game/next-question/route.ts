import { NextResponse } from "next/server";
import { gameSessionDb } from "@/lib/db/game-session";
import { clearVotingSession } from "@/lib/voting/session-manager";
import { sseManager } from "@/lib/sse/manager";
import { prisma } from "@/lib/db/prisma";

export async function POST() {
  console.log("🎯 NEXT-QUESTION API: Endpoint called");
  try {
    const session = await gameSessionDb.nextQuestion();
    console.log("🎯 NEXT-QUESTION API: nextQuestion() result:", {
      sessionId: session?.id,
      status: session?.status,
      currentQuestionIndex: session?.currentQuestionIndex,
    });

    if (!session) {
      console.log(
        "🎯 NEXT-QUESTION API: No session returned from nextQuestion()"
      );
      return NextResponse.json(
        {
          success: false,
          error: "Nie znaleziono aktywnej sesji lub osiągnięto koniec pytań",
        },
        { status: 404 }
      );
    }

    // Wyczyść sesję głosowania przy przejściu do kolejnego pytania
    clearVotingSession();

    // Pobierz aktualne pytanie wraz z jego danymi
    const sessionQuestions = await prisma.gameSessionQuestion.findMany({
      where: { gameSessionId: session.id },
      orderBy: { order: "asc" },
      include: { question: true },
    });

    const currentQuestion =
      sessionQuestions[session.currentQuestionIndex]?.question;
    const currentQuestionFormatted = currentQuestion
      ? {
          id: currentQuestion.id,
          content: currentQuestion.content,
          answers: {
            A: currentQuestion.answerA,
            B: currentQuestion.answerB,
            C: currentQuestion.answerC,
            D: currentQuestion.answerD,
          },
          correctAnswer: currentQuestion.correctAnswer as "A" | "B" | "C" | "D",
        }
      : null;

    // Pobierz ukryte odpowiedzi dla nowego pytania (jeśli są)
    const hiddenAnswersForCurrentQuestion =
      session.hiddenAnswers[session.currentQuestionIndex] || [];

    // Broadcast SSE event o zmianie pytania
    const eventData = {
      questionIndex: session.currentQuestionIndex,
      totalQuestions: session.totalQuestions,
      questionId: session.id, // ID sesji, nie pytania
      status: session.status,
      currentQuestion: currentQuestionFormatted,
      hiddenAnswers: hiddenAnswersForCurrentQuestion,
    };

    console.log(
      "🎯 NEXT-QUESTION API: Broadcasting question-changed event:",
      eventData
    );
    sseManager.broadcast("question-changed", eventData, "all");
    console.log("🎯 NEXT-QUESTION API: Broadcast completed");

    return NextResponse.json({
      success: true,
      data: session,
      message: "Przeszło do następnego pytania",
    });
  } catch (error) {
    console.error("Błąd przejścia do następnego pytania:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Błąd przejścia do następnego pytania",
      },
      { status: 500 }
    );
  }
}
