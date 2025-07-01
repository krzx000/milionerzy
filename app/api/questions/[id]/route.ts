import { NextRequest, NextResponse } from "next/server";
import { questionsDb } from "@/lib/db/questions";

// GET /api/questions/[id] - pobierz pojedyncze pytanie
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const question = await questionsDb.getById(id);

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Pytanie nie zostało znalezione" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: question,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Błąd pobierania pytania" },
      { status: 500 }
    );
  }
}

// PUT /api/questions/[id] - zaktualizuj pytanie
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const updatedQuestion = await questionsDb.update(id, {
      content: body.content,
      answers: body.answers,
      correctAnswer: body.correctAnswer,
    });

    if (!updatedQuestion) {
      return NextResponse.json(
        { success: false, error: "Pytanie nie zostało znalezione" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedQuestion,
      message: "Pytanie zostało zaktualizowane",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Błąd aktualizacji pytania" },
      { status: 500 }
    );
  }
}

// DELETE /api/questions/[id] - usuń pytanie
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deletedQuestion = await questionsDb.delete(id);

    if (!deletedQuestion) {
      return NextResponse.json(
        { success: false, error: "Pytanie nie zostało znalezione" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: deletedQuestion,
      message: "Pytanie zostało usunięte",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Błąd usuwania pytania" },
      { status: 500 }
    );
  }
}
