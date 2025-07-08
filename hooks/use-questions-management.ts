import * as React from "react";
import { QuestionsAPI } from "@/lib/api/questions";
import { Question as QuestionType } from "@/types/question";
import { SAMPLE_QUESTIONS } from "@/lib/constants/game";
import { toast } from "sonner";

export function useQuestionsManagement() {
  const [questions, setQuestions] = React.useState<QuestionType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedQuestions, setSelectedQuestions] = React.useState<
    QuestionType[]
  >([]);

  const showErrorMessage = React.useCallback((message: string) => {
    toast.error(message);
  }, []);

  const loadQuestions = React.useCallback(async () => {
    setLoading(true);

    const response = await QuestionsAPI.getAll();

    if (response.success && response.data) {
      setQuestions(response.data);
    } else {
      showErrorMessage(response.error || "Błąd ładowania pytań");
      setQuestions([...SAMPLE_QUESTIONS] as QuestionType[]);
    }

    setLoading(false);
  }, [showErrorMessage]);

  const handleSaveQuestion = React.useCallback(
    async (questionData: Omit<QuestionType, "id"> & { id?: string }) => {
      if (questionData.id) {
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

  const handleDeleteQuestion = React.useCallback(
    async (id: string) => {
      const response = await QuestionsAPI.delete(id);

      if (response.success) {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
        setSelectedQuestions((prev) => prev.filter((q) => q.id !== id));
      } else {
        showErrorMessage(response.error || "Błąd usuwania pytania");
      }
    },
    [showErrorMessage]
  );

  const handleDeleteSelectedQuestions = React.useCallback(async () => {
    if (selectedQuestions.length === 0) return;

    const selectedIds = selectedQuestions.map((q) => q.id);
    const response = await QuestionsAPI.deleteMany(selectedIds);

    if (response.success) {
      setQuestions((prev) => prev.filter((q) => !selectedIds.includes(q.id)));
      setSelectedQuestions([]);
    } else {
      showErrorMessage(response.error || "Błąd usuwania pytań");
    }
  }, [selectedQuestions, showErrorMessage]);

  const handleDeleteAllQuestions = React.useCallback(async () => {
    if (questions.length === 0) return;

    const response = await QuestionsAPI.deleteAll();

    if (response.success) {
      setQuestions([]);
      setSelectedQuestions([]);
    } else {
      showErrorMessage(response.error || "Błąd usuwania wszystkich pytań");
    }
  }, [questions.length, showErrorMessage]);

  return {
    questions,
    loading,
    selectedQuestions,
    setSelectedQuestions,
    loadQuestions,
    handleSaveQuestion,
    handleDeleteQuestion,
    handleDeleteSelectedQuestions,
    handleDeleteAllQuestions,
  };
}
