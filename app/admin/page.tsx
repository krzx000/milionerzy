"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditIcon, TrashIcon, PlusIcon, EyeIcon } from "lucide-react";
import { Question as QuestionType } from "@/types/question";
import { QuestionDialog } from "@/components/question-dialog";
import { QuestionViewDialog } from "@/components/question-view-dialog";
import { ThemeButton, ThemeToggle } from "@/components/theme-toggle";
import { QuestionsAPI } from "@/lib/api/questions";

const sampleQuestions: QuestionType[] = [
  {
    id: "1",
    content: "Stolica Polski to:",
    answers: {
      A: "Kraków",
      B: "Warszawa",
      C: "Gdańsk",
      D: "Wrocław",
    },
    correctAnswer: "B",
  },
  {
    id: "2",
    content: "Kto napisał 'Pan Tadeusz'?",
    answers: {
      A: "Adam Mickiewicz",
      B: "Juliusz Słowacki",
      C: "Henryk Sienkiewicz",
      D: "Bolesław Prus",
    },
    correctAnswer: "A",
  },
  {
    id: "3",
    content:
      "Jaka jest wartość liczby π z dokładnością do trzech miejsc po przecinku?",
    answers: {
      A: "3.141",
      B: "3.142",
      C: "3.143",
      D: "3.144",
    },
    correctAnswer: "B",
  },
];

export default function Admin() {
  const [questions, setQuestions] = React.useState<QuestionType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [editingQuestion, setEditingQuestion] = React.useState<
    QuestionType | undefined
  >();
  const [viewingQuestion, setViewingQuestion] =
    React.useState<QuestionType | null>(null);
  const [selectedQuestions, setSelectedQuestions] = React.useState<
    QuestionType[]
  >([]);

  // Ładowanie pytań z API przy inicjalizacji
  React.useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);

    const response = await QuestionsAPI.getAll();

    if (response.success && response.data) {
      setQuestions(response.data);
    } else {
      setError(response.error || "Błąd ładowania pytań");
      // Fallback do przykładowych pytań
      setQuestions(sampleQuestions);
    }

    setLoading(false);
  };

  const showErrorMessage = React.useCallback((message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  }, []);

  const handleAddQuestion = React.useCallback(() => {
    setEditingQuestion(undefined);
    setIsQuestionDialogOpen(true);
  }, []);

  const handleEditQuestion = React.useCallback((question: QuestionType) => {
    setEditingQuestion(question);
    setIsQuestionDialogOpen(true);
  }, []);

  const handleViewQuestion = React.useCallback((question: QuestionType) => {
    setViewingQuestion(question);
    setIsViewDialogOpen(true);
  }, []);

  const handleDeleteQuestion = React.useCallback(
    async (id: string) => {
      if (confirm("Czy na pewno chcesz usunąć to pytanie?")) {
        const response = await QuestionsAPI.delete(id);

        if (response.success) {
          setQuestions((prev) => prev.filter((q) => q.id !== id));
          // Usuń pytanie z listy zaznaczonych jeśli było zaznaczone
          setSelectedQuestions((prev) => prev.filter((q) => q.id !== id));
        } else {
          showErrorMessage(response.error || "Błąd usuwania pytania");
        }
      }
    },
    [showErrorMessage]
  );

  const handleSaveQuestion = React.useCallback(
    async (questionData: Omit<QuestionType, "id"> & { id?: string }) => {
      if (questionData.id) {
        // Edit existing question
        const response = await QuestionsAPI.update(questionData.id, {
          content: questionData.content,
          answers: questionData.answers,
          correctAnswer: questionData.correctAnswer,
        });

        if (response.success && response.data) {
          setQuestions((prev) =>
            prev.map((q) => (q.id === questionData.id ? response.data! : q))
          );
        } else {
          showErrorMessage(response.error || "Błąd aktualizacji pytania");
        }
      } else {
        // Add new question
        const response = await QuestionsAPI.create({
          content: questionData.content,
          answers: questionData.answers,
          correctAnswer: questionData.correctAnswer,
        });

        if (response.success && response.data) {
          setQuestions((prev) => [...prev, response.data!]);
        } else {
          showErrorMessage(response.error || "Błąd dodawania pytania");
        }
      }
    },
    [showErrorMessage]
  );

  const handleDeleteSelectedQuestions = React.useCallback(async () => {
    if (selectedQuestions.length === 0) return;

    const message =
      selectedQuestions.length === 1
        ? "Czy na pewno chcesz usunąć wybrane pytanie?"
        : `Czy na pewno chcesz usunąć ${selectedQuestions.length} wybranych pytań?`;

    if (confirm(message)) {
      const selectedIds = selectedQuestions.map((q) => q.id);
      const response = await QuestionsAPI.deleteMany(selectedIds);

      if (response.success) {
        setQuestions((prev) => prev.filter((q) => !selectedIds.includes(q.id)));
        setSelectedQuestions([]);
      } else {
        showErrorMessage(response.error || "Błąd usuwania pytań");
      }
    }
  }, [selectedQuestions, showErrorMessage]);

  const handleDeleteAllQuestions = React.useCallback(async () => {
    if (questions.length === 0) return;

    if (
      confirm(
        `Czy na pewno chcesz usunąć wszystkie ${questions.length} pytań? Ta akcja jest nieodwracalna!`
      )
    ) {
      const response = await QuestionsAPI.deleteAll();

      if (response.success) {
        setQuestions([]);
        setSelectedQuestions([]);
      } else {
        showErrorMessage(response.error || "Błąd usuwania wszystkich pytań");
      }
    }
  }, [questions.length, showErrorMessage]);

  const handleRowSelectionChange = React.useCallback(
    (selectedRows: QuestionType[]) => {
      setSelectedQuestions(selectedRows);
    },
    []
  );

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "content" as keyof QuestionType,
        header: "Pytanie",
        cell: ({ row }: { row: { original: QuestionType } }) => (
          <div className="max-w-[300px] truncate" title={row.original.content}>
            {row.original.content}
          </div>
        ),
      },

      {
        accessorKey: "correctAnswer" as keyof QuestionType,
        header: "Poprawna odpowiedź",
        cell: ({ row }: { row: { original: QuestionType } }) => (
          <Badge variant="outline">
            {row.original.correctAnswer}:{" "}
            {row.original.answers[row.original.correctAnswer]}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Akcje",
        cell: ({ row }: { row: { original: QuestionType } }) => (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewQuestion(row.original)}
            >
              <EyeIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditQuestion(row.original)}
            >
              <EditIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteQuestion(row.original.id)}
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [handleViewQuestion, handleEditQuestion, handleDeleteQuestion]
  );
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Header z przełącznikiem motywu */}
      <div className="w-full p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Panel Prowadzącego - Milionerzy</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

      <div className="grid min-h-screen grid-cols-12 gap-4 p-4">
        {/* Powiadomienie o błędach */}
        {error && (
          <div className="col-span-12 p-4 mb-4 text-red-800 bg-red-100 border border-red-300 rounded">
            <strong>Błąd:</strong> {error}
          </div>
        )}

        {/* Lista pytań + edycja i wgrywanie (duży panel po lewej) */}
        <section className="col-span-5 row-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Pytania</CardTitle>
              <CardDescription>Zarządzaj pytaniami w grze</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap gap-2">
                <Button onClick={handleAddQuestion} disabled={loading}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Dodaj pytanie
                </Button>
                {selectedQuestions.length > 0 && (
                  <Button
                    variant="destructive"
                    onClick={handleDeleteSelectedQuestions}
                    disabled={loading}
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Usuń wybrane ({selectedQuestions.length})
                  </Button>
                )}
                {questions.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleDeleteAllQuestions}
                    disabled={loading}
                    className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Usuń wszystkie ({questions.length})
                  </Button>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Ładowanie pytań...</span>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={questions}
                  enableRowSelection={true}
                  onRowSelectionChange={handleRowSelectionChange}
                />
              )}
            </CardContent>
          </Card>
        </section>

        {/* Ustawienia gry (obok listy pytań) */}
        <section className="col-span-3 row-span-3 p-4 space-y-4 border rounded">
          <h2 className="mb-2 text-lg font-semibold">Ustawienia gry</h2>

          <div>
            <label className="block mb-1 font-medium">
              Liczba rund (max 12)
            </label>
            <input
              type="number"
              max={12}
              className="w-full px-2 py-1 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Kwoty gwarantowane (do 2)
            </label>
            {/* np. dwa inputy */}
            <input
              type="text"
              placeholder="Kwota 1"
              className="w-full px-2 py-1 mb-1 border rounded"
            />
            <input
              type="text"
              placeholder="Kwota 2"
              className="w-full px-2 py-1 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Nagrody za pytania</label>
            {/* Można dodać textarea lub inny kontroler */}
            <textarea rows={3} className="w-full px-2 py-1 border rounded" />
          </div>

          <div className="flex items-center space-x-2">
            <label className="font-medium">Koła ratunkowe</label>
            <input type="checkbox" />
          </div>

          {/* Przełącznik motywu */}
          <div className="space-y-2">
            <label className="block font-medium">Motyw interfejsu</label>
            <div className="flex gap-2">
              <ThemeButton targetTheme="dark" className="flex-1">
                🌙 Ciemny
              </ThemeButton>
              <ThemeToggle />
            </div>
          </div>

          <button className="w-full py-2 mt-4 text-white transition bg-blue-600 rounded hover:bg-blue-700">
            Start gry
          </button>
        </section>

        {/* Podgląd aktualnego pytania + opcje odpowiedzi (prawa kolumna, góra) */}
        <section className="col-span-4 row-span-2 p-4 border rounded">
          {/*  */}
        </section>

        {/* Sterowanie kołami ratunkowymi (pod aktualnym pytaniem) */}
        <section className="col-span-4 row-span-1 p-4 mt-2 border rounded">
          <h2 className="mb-2 text-lg font-semibold">Koła ratunkowe</h2>
          <div className="flex space-x-4">
            <button className="flex-1 py-2 text-black transition bg-yellow-400 rounded hover:bg-yellow-500">
              50:50
            </button>
            <button className="flex-1 py-2 text-black transition bg-green-400 rounded hover:bg-green-500">
              Telefg-gre przyjaciela
            </button>
            <button className="flex-1 py-2 text-black transition bg-purple-400 rounded hover:bg-purple-500">
              Pytanie do publiczności
            </button>
          </div>
        </section>

        {/* Zakończenie gry (dolna część prawej kolumny) */}
        <section className="flex justify-center col-span-12 pt-4 mt-4 border-t">
          <button className="px-6 py-2 text-white transition bg-red-600 rounded hover:bg-red-700">
            Zakończ grę
          </button>
        </section>
      </div>

      {/* Dialogs */}
      <QuestionDialog
        open={isQuestionDialogOpen}
        onOpenChange={setIsQuestionDialogOpen}
        question={editingQuestion}
        onSave={handleSaveQuestion}
      />

      <QuestionViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        question={viewingQuestion}
      />
    </div>
  );
}
