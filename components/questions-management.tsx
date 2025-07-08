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
import { EditIcon, TrashIcon, PlusIcon, EyeIcon } from "lucide-react";
import { Question as QuestionType } from "@/types/question";
import { QuestionDialog } from "@/components/question-dialog";
import { QuestionViewDialog } from "@/components/question-view-dialog";
import { QuestionImportDialog } from "@/components/question-import-dialog";
import { toast } from "sonner";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { QuestionsAPI } from "@/lib/api/questions";
import { SAMPLE_QUESTIONS } from "@/lib/constants/game";
import { Badge } from "./ui/badge";

interface QuestionsManagementProps {
  questions: QuestionType[];
  loading: boolean;
  isGameActive: boolean;
  selectedQuestions: QuestionType[];
  setQuestions: React.Dispatch<React.SetStateAction<QuestionType[]>>;
  setSelectedQuestions: React.Dispatch<React.SetStateAction<QuestionType[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  // Dodane propsy dla funkcjonalności pixelowania
  currentQuestion?: QuestionType | null;
  isAnswerRevealed?: boolean;
}

export function QuestionsManagement({
  questions,
  loading,
  isGameActive,
  selectedQuestions,
  setQuestions,
  setSelectedQuestions,
  setLoading,
}: QuestionsManagementProps) {
  const { confirm, dialog } = useConfirmDialog();
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [editingQuestion, setEditingQuestion] = React.useState<
    QuestionType | undefined
  >();
  const [viewingQuestion, setViewingQuestion] =
    React.useState<QuestionType | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);

  const loadQuestions = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await QuestionsAPI.getAll();
      setQuestions(result.data || []);
    } catch (error) {
      console.error("Error loading questions:", error);
      toast.error("Błąd podczas ładowania pytań");
    } finally {
      setLoading(false);
    }
  }, [setQuestions, setLoading]);

  React.useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleAddQuestion = () => {
    setEditingQuestion(undefined);
    setIsQuestionDialogOpen(true);
  };

  const handleEditQuestion = React.useCallback((question: QuestionType) => {
    setEditingQuestion(question);
    setIsQuestionDialogOpen(true);
  }, []);

  const handleViewQuestion = React.useCallback((question: QuestionType) => {
    setViewingQuestion(question);
    setIsViewDialogOpen(true);
  }, []);

  const handleDeleteQuestion = React.useCallback(
    async (questionId: string) => {
      const confirmed = await confirm({
        title: "Usuń pytanie",
        description:
          "Czy na pewno chcesz usunąć to pytanie? Ta operacja jest nieodwracalna.",
        variant: "destructive",
      });

      if (!confirmed) return;

      try {
        await QuestionsAPI.delete(questionId);
        setQuestions((prev) => prev.filter((q) => q.id !== questionId));
        toast.success("Pytanie zostało usunięte");
      } catch (error) {
        console.error("Error deleting question:", error);
        toast.error("Błąd podczas usuwania pytania");
      }
    },
    [confirm, setQuestions]
  );

  const handleDeleteSelected = async () => {
    if (selectedQuestions.length === 0) return;

    const confirmed = await confirm({
      title: "Usuń pytania",
      description: `Czy na pewno chcesz usunąć ${selectedQuestions.length} pytań? Ta operacja jest nieodwracalna.`,
      variant: "destructive",
    });

    if (!confirmed) return;

    try {
      await Promise.all(
        selectedQuestions.map((q) => QuestionsAPI.delete(q.id))
      );
      setQuestions((prev) =>
        prev.filter((q) => !selectedQuestions.some((sq) => sq.id === q.id))
      );
      setSelectedQuestions([]);
      toast.success(`Usunięto ${selectedQuestions.length} pytań`);
    } catch (error) {
      console.error("Error deleting questions:", error);
      toast.error("Błąd podczas usuwania pytań");
    }
  };

  const handleImportSampleQuestions = async () => {
    const confirmed = await confirm({
      title: "Importuj przykładowe pytania",
      description:
        "Czy chcesz zaimportować przykładowe pytania? Zostaną dodane 3 przykładowe pytania do bazy danych.",
    });

    if (!confirmed) return;

    setLoading(true);
    try {
      for (const sampleQuestion of SAMPLE_QUESTIONS) {
        await QuestionsAPI.create({
          content: sampleQuestion.content,
          answers: sampleQuestion.answers,
          correctAnswer: sampleQuestion.correctAnswer,
        });
      }
      await loadQuestions();
      toast.success("Przykładowe pytania zostały zaimportowane");
    } catch (error) {
      console.error("Error importing sample questions:", error);
      toast.error("Błąd podczas importowania pytań");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionSaved = () => {
    setIsQuestionDialogOpen(false);
    setEditingQuestion(undefined);
    loadQuestions();
  };

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "content" as keyof QuestionType,
        header: "Treść pytania",
        cell: ({ row }: { row: { original: QuestionType } }) => (
          <div className="max-w-xs truncate">{row.original.content}</div>
        ),
      },
      {
        accessorKey: "correctAnswer" as keyof QuestionType,
        header: "Poprawna odpowiedź",
        cell: ({ row }: { row: { original: QuestionType } }) => {
          const answer = row.original.correctAnswer;
          const answerText = row.original.answers[answer];
          const shouldBlur = isGameActive;

          return (
            <Badge
              variant="outline"
              className={`truncate max-w-[200px] ${
                shouldBlur
                  ? "pixelated-text select-none pointer-events-none"
                  : ""
              }`}
              title={
                shouldBlur ? "Ukryte podczas gry" : `${answer}: ${answerText}`
              }
            >
              <span className="truncate">
                {answer}: {answerText}
              </span>
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Akcje",
        cell: ({ row }: { row: { original: QuestionType } }) => (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleViewQuestion(row.original)}
            >
              <EyeIcon className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEditQuestion(row.original)}
              disabled={isGameActive}
            >
              <EditIcon className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDeleteQuestion(row.original.id)}
              disabled={isGameActive}
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    [isGameActive, handleViewQuestion, handleEditQuestion, handleDeleteQuestion]
  );

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Pytania {isGameActive && "🔒"}</CardTitle>
          <CardDescription>
            {isGameActive
              ? "Przeglądaj pytania (zarządzanie zablokowane podczas gry)"
              : "Zarządzaj pytaniami w grze"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isGameActive && (
            <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-300/80 dark:border-yellow-200/40 rounded-lg">
              <p className="text-sm  text-yellow-600 dark:text-yellow-200">
                ⚠️ Gra jest aktywna. Zarządzanie pytaniami jest zablokowane.
                Można tylko przeglądać.
              </p>
            </div>
          )}
          <div className="mb-4 flex flex-col sm:flex-row flex-wrap gap-2">
            <Button
              onClick={handleAddQuestion}
              disabled={loading || isGameActive}
              className="flex-1 xl:flex-none"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Dodaj pytanie
            </Button>
            {selectedQuestions.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleDeleteSelected}
                disabled={loading || isGameActive}
                className="flex-1 xl:flex-none"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Usuń zaznaczone ({selectedQuestions.length})
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleImportSampleQuestions}
              disabled={loading || isGameActive}
              className="flex-1 xl:flex-none"
            >
              Importuj przykładowe pytania
            </Button>
            <Button
              variant="outline"
              disabled={loading || isGameActive}
              className="flex-1 xl:flex-none"
              onClick={() => setIsImportDialogOpen(true)}
            >
              Importuj z pliku
            </Button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Ładowanie pytań...</span>
            </div>
          ) : (
            <DataTable columns={columns} data={questions} />
          )}
        </CardContent>
      </Card>

      <QuestionDialog
        open={isQuestionDialogOpen}
        onOpenChange={setIsQuestionDialogOpen}
        question={editingQuestion}
        onSave={handleQuestionSaved}
      />

      <QuestionViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        question={viewingQuestion}
      />

      <QuestionImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onImportSuccess={loadQuestions}
      />

      {dialog}
    </>
  );
}
