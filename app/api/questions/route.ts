import { NextRequest, NextResponse } from "next/server";
import { questionsDb } from "@/lib/db/questions";

// GET /api/questions - pobierz wszystkie pytania
export async function GET() {
  try {
    const questions = await questionsDb.getAll();
    return NextResponse.json({
      success: true,
      data: questions,
      count: questions.length,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Błąd pobierania pytań" },
      { status: 500 }
    );
  }
}

// POST /api/questions - dodaj nowe pytanie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Walidacja danych
    if (!body.content || !body.answers || !body.correctAnswer) {
      return NextResponse.json(
        { success: false, error: "Brakuje wymaganych pól" },
        { status: 400 }
      );
    }

    // Sprawdź czy odpowiedzi zawierają A, B, C, D
    const requiredAnswers = ["A", "B", "C", "D"];
    const hasAllAnswers = requiredAnswers.every((key) => body.answers[key]);

    if (!hasAllAnswers) {
      return NextResponse.json(
        {
          success: false,
          error: "Wszystkie odpowiedzi A, B, C, D są wymagane",
        },
        { status: 400 }
      );
    }

    // Sprawdź czy poprawna odpowiedź to jedna z A, B, C, D
    if (!requiredAnswers.includes(body.correctAnswer)) {
      return NextResponse.json(
        { success: false, error: "Poprawna odpowiedź musi być A, B, C lub D" },
        { status: 400 }
      );
    }

    const newQuestion = await questionsDb.create({
      content: body.content,
      answers: body.answers,
      correctAnswer: body.correctAnswer,
    });

    return NextResponse.json(
      {
        success: true,
        data: newQuestion,
        message: "Pytanie zostało dodane",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Błąd dodawania pytania" },
      { status: 500 }
    );
  }
}

// DELETE /api/questions - usuń wszystkie pytania (dla operacji "usuń wszystkie")
export async function DELETE() {
  try {
    const deletedCount = await questionsDb.deleteAll();

    return NextResponse.json({
      success: true,
      message: `Usunięto ${deletedCount} pytań`,
      deletedCount,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Błąd usuwania pytań" },
      { status: 500 }
    );
  }
}
