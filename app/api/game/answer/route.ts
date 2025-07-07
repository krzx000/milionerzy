import { NextRequest, NextResponse } from "next/server";
import { gameSessionDb } from "@/lib/db/game-session";
import { questionsDb } from "@/lib/db/questions";

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

    // Pobierz aktualne pytanie
    const questions = await questionsDb.getAll();
    const currentQuestion = questions[session.currentQuestionIndex];

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

    if (!isCorrect) {
      // Niepoprawna odpowiedź - zakończ grę
      const endedSession = await gameSessionDb.end();
      return NextResponse.json({
        success: true,
        data: {
          ...endedSession,
          correct: false,
          correctAnswer: currentQuestion.correctAnswer,
        },
        message: "Niepoprawna odpowiedź. Gra zakończona.",
        correct: false,
        correctAnswer: currentQuestion.correctAnswer,
      });
    }

    // Poprawna odpowiedź
    if (session.currentQuestionIndex >= questions.length - 1) {
      // To było ostatnie pytanie - gracz wygrał!
      const endedSession = await gameSessionDb.end();
      return NextResponse.json({
        success: true,
        data: {
          ...endedSession,
          correct: true,
          gameWon: true,
          correctAnswer: currentQuestion.correctAnswer,
        },
        message:
          "Gratulacje! Gracz odpowiedział poprawnie na wszystkie pytania!",
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
