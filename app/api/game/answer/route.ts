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

    // Pobierz aktualne pytanie z sesji, a nie z globalnej listy
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

    const isCorrect = answer === currentQuestion.correctAnswer;

    // Broadcast SSE event o ujawnieniu odpowiedzi
    sseManager.broadcast(
      "answer-revealed",
      {
        selectedAnswer: answer,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect,
        questionIndex: session.currentQuestionIndex,
        questionId: currentQuestion.id,
        gameWon: false, // Będzie zaktualizowane niżej jeśli prawda
      },
      "all"
    );

    if (!isCorrect) {
      // Niepoprawna odpowiedź - zakończ grę
      const finishedSession = await gameSessionDb.finishGame(false);
      return NextResponse.json({
        success: true,
        data: {
          ...finishedSession,
          correct: false,
          correctAnswer: currentQuestion.correctAnswer,
        },
        message: "Niepoprawna odpowiedź. Gra zakończona.",
        correct: false,
        correctAnswer: currentQuestion.correctAnswer,
      });
    }

    // Poprawna odpowiedź
    // Sprawdź czy to było ostatnie pytanie (12 pytań = indeksy 0-11, więc ostatnie to indeks 11)
    if (session.currentQuestionIndex >= 11) {
      // To było ostatnie pytanie - gracz wygrał! Zakończ grę
      const finishedSession = await gameSessionDb.finishGame(true);

      // Broadcast SSE event o wygranej
      sseManager.broadcast(
        "answer-revealed",
        {
          selectedAnswer: answer,
          correctAnswer: currentQuestion.correctAnswer,
          isCorrect: true,
          questionIndex: session.currentQuestionIndex,
          questionId: currentQuestion.id,
          gameWon: true,
        },
        "all"
      );

      return NextResponse.json({
        success: true,
        data: {
          ...finishedSession,
          correct: true,
          gameWon: true,
          correctAnswer: currentQuestion.correctAnswer,
        },
        message:
          "Gratulacje! Gracz odpowiedział poprawnie na wszystkie 12 pytań!",
        correct: true,
        gameWon: true,
        correctAnswer: currentQuestion.correctAnswer,
      });
    } else {
      // Poprawna odpowiedź - NIE przechodź automatycznie do następnego pytania
      // UI będzie wywołać osobny endpoint do przejścia dalej po opóźnieniu
      return NextResponse.json({
        success: true,
        data: {
          ...session,
          correct: true,
          gameWon: false,
          correctAnswer: currentQuestion.correctAnswer,
        },
        message: "Poprawna odpowiedź!",
        correct: true,
        gameWon: false,
        correctAnswer: currentQuestion.correctAnswer,
      });
    }
  } catch (error) {
    console.error("Błąd przetwarzania odpowiedzi:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Błąd przetwarzania odpowiedzi",
      },
      { status: 500 }
    );
  }
}
