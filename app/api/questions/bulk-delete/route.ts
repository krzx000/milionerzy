import { NextRequest, NextResponse } from "next/server";
import { questionsDb } from "@/lib/db/questions";

// Endpoint do usuwania wielu pytań na podstawie listy ID
// POST /api/questions/bulk-delete
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.ids || !Array.isArray(body.ids)) {
      return NextResponse.json(
        { success: false, error: "Wymagana jest tablica ID pytań" },
        { status: 400 }
      );
    }

    const deletedQuestions = await questionsDb.deleteMany(body.ids);

    return NextResponse.json({
      success: true,
      message: `Usunięto ${deletedQuestions.length} pytań`,
      deletedIds: body.ids,
      deletedCount: deletedQuestions.length,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Błąd usuwania pytań" },
      { status: 500 }
    );
  }
}
