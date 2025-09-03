import { NextRequest, NextResponse } from "next/server";
import { sseManager } from "@/lib/sse/manager";

// POST: { effect: "play-start"|"play-answer"|"play-win"|"play-lose"|"transition" , questionLevel?: number }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { effect, questionLevel = 1 } = body as {
      effect:
        | "play-start"
        | "play-answer"
        | "play-win"
        | "play-lose"
        | "transition";
      questionLevel?: number;
    };

    // Wysyłamy prosty admin-message/answer-selected/answer-revealed, aby klienci mogli zareagować dźwiękiem i transition
    switch (effect) {
      case "play-start":
        sseManager.broadcast(
          "question-changed",
          {
            questionIndex: Math.max(0, questionLevel - 1),
            questionId: "debug",
            hiddenAnswers: [],
          },
          "player"
        );
        break;
      case "play-answer":
        sseManager.broadcast(
          "answer-selected",
          { selectedAnswer: "A", questionIndex: 0, questionId: "debug" },
          "player"
        );
        break;
      case "play-win":
        sseManager.broadcast(
          "answer-revealed",
          {
            selectedAnswer: "A",
            correctAnswer: "A",
            isCorrect: true,
            questionIndex: Math.max(0, questionLevel - 1),
            questionId: "debug",
          },
          "player"
        );
        break;
      case "play-lose":
        sseManager.broadcast(
          "answer-revealed",
          {
            selectedAnswer: "A",
            correctAnswer: "B",
            isCorrect: false,
            questionIndex: Math.max(0, questionLevel - 1),
            questionId: "debug",
          },
          "player"
        );
        break;
      case "transition":
        sseManager.broadcast(
          "admin-message",
          { type: "debug-transition", message: "Force transition" },
          "player"
        );
        break;
      default:
        return NextResponse.json(
          { success: false, error: "Unknown effect" },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DEBUG effects error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
