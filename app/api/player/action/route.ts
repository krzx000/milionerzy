import { NextRequest, NextResponse } from "next/server";
import { broadcastEvent } from "@/lib/sse/manager";
import { gameSessionDb } from "@/lib/db/game-session";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    console.log("Player API: Otrzymano akcję:", action, data);

    if (!action) {
      console.log("Player API: Brak akcji w żądaniu");
      return NextResponse.json(
        { success: false, error: "Brak akcji" },
        { status: 400 }
      );
    }

    console.log("Player API: Przetwarzanie akcji:", action);

    switch (action) {
      case "ping":
        // Ping endpoint do sprawdzania połączenia
        return NextResponse.json({
          success: true,
          message: "Player connection active",
        });

      case "request-current-state":
        // Żądanie aktualnego stanu gry
        try {
          console.log("Player API: Przetwarzanie request-current-state...");

          // Pobierz aktualną sesję gry (tylko aktywne)
          const session = await gameSessionDb.getCurrent();

          if (!session) {
            console.log("Player API: Brak aktywnej sesji gry - gracz czeka");
            broadcastEvent(
              "game-reset",
              {
                message: "Resetowanie stanu - oczekiwanie na grę",
              },
              "player"
            );
          } else {
            console.log(
              "Player API: Znaleziona aktywna sesja:",
              session.id,
              "status:",
              session.status,
              "pytanie:",
              session.currentQuestionIndex + 1
            );

            // Pobierz pytania powiązane z sesją
            const sessionQuestions = await prisma.gameSessionQuestion.findMany({
              where: { gameSessionId: session.id },
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

            const currentQuestion =
              questions[session.currentQuestionIndex] || null;
            const hiddenAnswers =
              session.hiddenAnswers[session.currentQuestionIndex] || [];

            console.log(
              "Player API: Wysyłanie aktywnej gry - pytanie",
              session.currentQuestionIndex + 1,
              "currentQuestion:",
              currentQuestion ? "TAK" : "NIE"
            );

            // Wyślij aktualny stan gry do gracza
            broadcastEvent(
              "game-started",
              {
                session,
                currentQuestion,
                questionIndex: session.currentQuestionIndex,
                totalQuestions: questions.length,
                hiddenAnswers,
              },
              "player"
            );
          }

          return NextResponse.json({
            success: true,
            message: "State request processed",
          });
        } catch (error) {
          console.error("Player API: Błąd pobierania stanu gry:", error);
          return NextResponse.json(
            { success: false, error: "Błąd pobierania stanu gry" },
            { status: 500 }
          );
        }

      case "log-player-action":
        // Logowanie akcji gracza dla celów debugowania/analizy
        console.log("Player action logged:", data);
        return NextResponse.json({
          success: true,
          message: "Action logged",
        });

      default:
        return NextResponse.json(
          { success: false, error: "Nieznana akcja" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Błąd w player action API:", error);
    return NextResponse.json(
      { success: false, error: "Błąd serwera" },
      { status: 500 }
    );
  }
}
