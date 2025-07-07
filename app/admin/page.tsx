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
import { ThemeToggle } from "@/components/theme-toggle";
import { QuestionsAPI } from "@/lib/api/questions";
import { GameAPI } from "@/lib/api/game";
import { GameSession } from "@/lib/db/game-session";
import { toast } from "sonner";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";

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
  const { confirm, dialog } = useConfirmDialog();
  const [questions, setQuestions] = React.useState<QuestionType[]>([]);
  const [loading, setLoading] = React.useState(true);
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

  // Stan gry - przywrócona obsługa przez API
  const [gameSession, setGameSession] = React.useState<GameSession | null>(
    null
  );
  const [gameLoading, setGameLoading] = React.useState(false);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(
    null
  );
  const [isAnswerRevealed, setIsAnswerRevealed] = React.useState(false);
  const [lastAnswerResult, setLastAnswerResult] = React.useState<{
    correct: boolean;
    gameWon: boolean;
    correctAnswer?: string;
  } | null>(null);

  // Computed values from game session
  const isGameActive = gameSession?.status === "active";
  const isGameEnded = gameSession?.status === "finished";
  const currentQuestionIndex = gameSession?.currentQuestionIndex || 0;
  const usedLifelines = React.useMemo(
    () =>
      gameSession?.usedLifelines || {
        fiftyFifty: false,
        phoneAFriend: false,
        askAudience: false,
      },
    [gameSession?.usedLifelines]
  );

  // Pobierz aktualne pytanie
  const currentQuestion =
    (isGameActive || isGameEnded) && questions.length > currentQuestionIndex
      ? questions[currentQuestionIndex]
      : null;

  // Konfiguracja czasu na automatyczne przejście (w sekundach)
  const AUTO_PROGRESS_TIME = 2;

  const showGameStatusMessage = React.useCallback((message: string) => {
    toast.info(message);
  }, []);

  const showSuccessMessage = React.useCallback((message: string) => {
    toast.success(message);
  }, []);

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
      // Fallback do przykładowych pytań
      setQuestions(sampleQuestions);
    }

    setLoading(false);
  }, [showErrorMessage]);

  const loadGameSession = React.useCallback(async () => {
    const response = await GameAPI.getCurrentSession();

    if (response.success && response.data) {
      // API zwraca tylko aktywne sesje
      setGameSession(response.data);
      // Reset UI state when loading session
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
      setLastAnswerResult(null);
    } else if (response.error) {
      showErrorMessage(response.error);
    }
    // Jeśli nie ma aktywnej sesji, zostaw gameSession jako null
  }, [showErrorMessage]);

  // Ładowanie pytań i sesji gry z API przy inicjalizacji
  React.useEffect(() => {
    loadQuestions();
    loadGameSession();
  }, [loadQuestions, loadGameSession]);

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
      const confirmed = await confirm({
        title: "Usunąć pytanie?",
        description:
          "Czy na pewno chcesz usunąć to pytanie? Ta akcja jest nieodwracalna.",
        confirmText: "Usuń",
        cancelText: "Anuluj",
        variant: "destructive",
      });

      if (confirmed) {
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
    [showErrorMessage, confirm]
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

    const confirmed = await confirm({
      title: "Usunąć wybrane pytania?",
      description: message + " Ta akcja jest nieodwracalna.",
      confirmText: "Usuń",
      cancelText: "Anuluj",
      variant: "destructive",
    });

    if (confirmed) {
      const selectedIds = selectedQuestions.map((q) => q.id);
      const response = await QuestionsAPI.deleteMany(selectedIds);

      if (response.success) {
        setQuestions((prev) => prev.filter((q) => !selectedIds.includes(q.id)));
        setSelectedQuestions([]);
      } else {
        showErrorMessage(response.error || "Błąd usuwania pytań");
      }
    }
  }, [selectedQuestions, showErrorMessage, confirm]);

  const handleDeleteAllQuestions = React.useCallback(async () => {
    if (questions.length === 0) return;

    const confirmed = await confirm({
      title: "Usunąć wszystkie pytania?",
      description: `Czy na pewno chcesz usunąć wszystkie ${questions.length} pytań? Ta akcja jest nieodwracalna!`,
      confirmText: "Usuń wszystkie",
      cancelText: "Anuluj",
      variant: "destructive",
    });

    if (confirmed) {
      const response = await QuestionsAPI.deleteAll();

      if (response.success) {
        setQuestions([]);
        setSelectedQuestions([]);
      } else {
        showErrorMessage(response.error || "Błąd usuwania wszystkich pytań");
      }
    }
  }, [questions.length, showErrorMessage, confirm]);

  const handleRowSelectionChange = React.useCallback(
    (selectedRows: QuestionType[]) => {
      setSelectedQuestions(selectedRows);
    },
    []
  );

  // Funkcje zarządzania grą - przez API
  const handleStartGame = React.useCallback(async () => {
    if (questions.length === 0) {
      showErrorMessage("Nie można rozpocząć gry bez pytań!");
      return;
    }

    setGameLoading(true);

    const response = await GameAPI.startGame();

    if (response.success && response.data) {
      setGameSession(response.data);

      // Reset stanu pytania
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
      setLastAnswerResult(null);

      showSuccessMessage("🎮 Gra rozpoczęta!");
    } else {
      showErrorMessage(response.error || "Błąd rozpoczynania gry");
    }

    setGameLoading(false);
  }, [questions.length, showErrorMessage, showSuccessMessage]);

  const handleEndGame = React.useCallback(async () => {
    try {
      const confirmed = await confirm({
        title: "Zakończyć grę?",
        description:
          "Czy na pewno chcesz zakończyć grę? Sesja zostanie zamknięta.",
        confirmText: isGameEnded ? "Zamknij sesję" : "Zakończ grę",
        cancelText: "Anuluj",
        variant: "destructive",
      });

      if (confirmed) {
        setGameLoading(true);

        const response = await GameAPI.endGame();

        if (response.success && response.data) {
          // Po pomyślnym zamknięciu sesji, ustaw gameSession na null
          // żeby UI wróciło do stanu "brak aktywnej gry"
          setGameSession(null);

          // Wyczyść stan
          setSelectedAnswer(null);
          setIsAnswerRevealed(false);
          setLastAnswerResult(null);

          showGameStatusMessage("🛑 Sesja gry zamknięta!");
        } else {
          showErrorMessage(response.error || "Błąd kończenia gry");
        }

        setGameLoading(false);
      }
    } catch (error) {
      console.error("handleEndGame: Exception:", error);
      setGameLoading(false);
    }
  }, [showGameStatusMessage, showErrorMessage, confirm, isGameEnded]);

  const handleUseLifeline = React.useCallback(
    async (lifelineType: keyof typeof usedLifelines) => {
      if (!gameSession || usedLifelines[lifelineType]) return;

      setGameLoading(true);

      const response = await GameAPI.activateLifeline(lifelineType);

      if (response.success && response.data) {
        setGameSession(response.data);

        // Mapowanie nazw kół ratunkowych na przyjazne nazwy
        const lifelineNames = {
          fiftyFifty: "50:50",
          phoneAFriend: "Telefon do przyjaciela",
          askAudience: "Pytanie do publiczności",
        };

        showGameStatusMessage(
          `Użyto koła ratunkowego: ${lifelineNames[lifelineType]}`
        );
      } else {
        showErrorMessage(response.error || "Błąd użycia koła ratunkowego");
      }

      setGameLoading(false);
    },
    [gameSession, usedLifelines, showGameStatusMessage, showErrorMessage]
  );

  const handleSelectAnswer = React.useCallback(
    (answer: string) => {
      if (!currentQuestion || gameLoading || isAnswerRevealed || isGameEnded)
        return;

      // Tylko zaznacz odpowiedź, nie wysyłaj jeszcze do API
      setSelectedAnswer(answer);
    },
    [currentQuestion, gameLoading, isAnswerRevealed, isGameEnded]
  );

  const handleConfirmAnswer = React.useCallback(async () => {
    if (
      !currentQuestion ||
      !selectedAnswer ||
      gameLoading ||
      isAnswerRevealed ||
      isGameEnded
    )
      return;

    setGameLoading(true);

    // Pierwszy delay - czas na muzykę/efekty przed sprawdzeniem
    showGameStatusMessage("🎵 Sprawdzanie odpowiedzi...");

    setTimeout(async () => {
      // Wyślij odpowiedź do API
      const response = await GameAPI.submitAnswer(selectedAnswer);

      if (response.success && response.data) {
        const responseData = response.data;
        const correct = responseData.correct;
        const correctAnswer = responseData.correctAnswer;
        const gameWon = responseData.gameWon;

        setGameSession(responseData as GameSession);
        setIsAnswerRevealed(true);
        setLastAnswerResult({
          correct: correct || false,
          gameWon: gameWon || false,
          correctAnswer: correctAnswer,
        });

        // Zatrzymaj loading tutaj, żeby UI pokazało wynik
        setGameLoading(false);

        if (correct) {
          if (gameWon) {
            showSuccessMessage("Gratulacje! Gracz wygrał wszystkie pytania!");
            // Zakończ grę po wygranej
            setTimeout(() => {
              setSelectedAnswer(null);
              setIsAnswerRevealed(false);
              setLastAnswerResult(null);
            }, 3000);
          } else {
            showSuccessMessage("Poprawna odpowiedź!");
            // Auto-progress jest teraz obsługiwany przez useEffect
          }
        } else {
          showErrorMessage(
            `Niepoprawna odpowiedź! Poprawna odpowiedź to: ${correctAnswer}.`
          );
          // API już zakończyło grę po błędnej odpowiedzi
          // Nie czyścimy UI - pozostawiamy widoczne dla prowadzącego
        }
      } else {
        showErrorMessage(response.error || "Błąd wysyłania odpowiedzi");
        setGameLoading(false);
      }
    }, 3000); // 3 sekundy delay na muzykę przed sprawdzeniem
  }, [
    currentQuestion,
    selectedAnswer,
    gameLoading,
    isAnswerRevealed,
    isGameEnded,
    showGameStatusMessage,
    showSuccessMessage,
    showErrorMessage,
  ]);

  // Effect do automatycznego przejścia do kolejnego pytania
  React.useEffect(() => {
    // Sprawdź czy powinniśmy automatycznie przejść do następnego pytania
    if (
      isAnswerRevealed &&
      lastAnswerResult?.correct &&
      !lastAnswerResult?.gameWon &&
      isGameActive &&
      !gameLoading
    ) {
      const timeoutId = setTimeout(async () => {
        try {
          const nextResponse = await GameAPI.nextQuestion();
          if (nextResponse.success && nextResponse.data) {
            setGameSession(nextResponse.data);
          }
          setSelectedAnswer(null);
          setIsAnswerRevealed(false);
          setLastAnswerResult(null);
        } catch (error) {
          console.error("Error in auto-progress nextQuestion:", error);
        }
      }, AUTO_PROGRESS_TIME * 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [
    isAnswerRevealed,
    lastAnswerResult,
    isGameActive,
    gameLoading,
    AUTO_PROGRESS_TIME,
  ]);

  const getCurrentPrize = () => {
    const prizes = [
      "500 zł",
      "1 000 zł",
      "2 000 zł",
      "5 000 zł",
      "10 000 zł",
      "20 000 zł",
      "40 000 zł",
      "75 000 zł",
      "125 000 zł",
      "250 000 zł",
      "500 000 zł",
      "1 000 000 zł",
    ];
    return prizes[Math.min(currentQuestionIndex, prizes.length - 1)] || "0 zł";
  };

  const getWinningPrize = () => {
    const prizes = [
      "500 zł",
      "1 000 zł",
      "2 000 zł",
      "5 000 zł",
      "10 000 zł",
      "20 000 zł",
      "40 000 zł",
      "75 000 zł",
      "125 000 zł",
      "250 000 zł",
      "500 000 zł",
      "1 000 000 zł",
    ];

    // Gracz wygrywa nagrodę za ostatnie poprawnie odpowiedziane pytanie
    // Jeśli currentQuestionIndex = 0, gracz jeszcze nie odpowiedział na żadne pytanie
    // Jeśli currentQuestionIndex = 1, gracz odpowiedział poprawnie na pytanie 1, więc wygrywa prizes[0] = 500 zł
    // Jeśli currentQuestionIndex = 5, gracz odpowiedział poprawnie na pytania 1-5, więc wygrywa prizes[4] = 10 000 zł

    if (currentQuestionIndex === 0) {
      return "0 zł"; // Gracz jeszcze nie odpowiedział na żadne pytanie
    }

    const winningIndex = currentQuestionIndex - 1;
    return prizes[winningIndex] || "0 zł";
  };

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "content" as keyof QuestionType,
        header: "Pytanie",
        cell: ({ row }: { row: { original: QuestionType } }) => (
          <div className="w-80 truncate" title={row.original.content}>
            {row.original.content}
          </div>
        ),
      },

      {
        accessorKey: "correctAnswer" as keyof QuestionType,
        header: "Poprawna odpowiedź",
        cell: ({ row }: { row: { original: QuestionType } }) => (
          <Badge
            variant="outline"
            className={`truncate max-w-[200px] ${
              isGameActive
                ? "pixelated-text select-none pointer-events-none"
                : ""
            }`}
            title={
              isGameActive
                ? "Ukryte podczas gry"
                : `${row.original.correctAnswer}: ${
                    row.original.answers[row.original.correctAnswer]
                  }`
            }
          >
            <span className="truncate">
              {row.original.correctAnswer}:{" "}
              {row.original.answers[row.original.correctAnswer]}
            </span>
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
              title="Podgląd pytania"
            >
              <EyeIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditQuestion(row.original)}
              disabled={isGameActive}
              title={
                isGameActive
                  ? "Edycja zablokowana podczas gry"
                  : "Edytuj pytanie"
              }
            >
              <EditIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteQuestion(row.original.id)}
              disabled={isGameActive}
              title={
                isGameActive
                  ? "Usuwanie zablokowane podczas gry"
                  : "Usuń pytanie"
              }
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [handleViewQuestion, handleEditQuestion, handleDeleteQuestion, isGameActive]
  );
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Fixed theme toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="grid min-h-screen grid-cols-12 gap-4 p-4">
        {/* Lista pytań + edycja i wgrywanie (duży panel po lewej) */}
        <section className="col-span-5 row-span-3">
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
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
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
                    onClick={handleDeleteSelectedQuestions}
                    disabled={loading || isGameActive}
                    className="flex-1 xl:flex-none"
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Usuń wybrane ({selectedQuestions.length})
                  </Button>
                )}
                {questions.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleDeleteAllQuestions}
                    disabled={loading || isGameActive}
                    className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground flex-1 xl:flex-none"
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
                  enableRowSelection={!isGameActive}
                  onRowSelectionChange={handleRowSelectionChange}
                />
              )}
            </CardContent>
          </Card>
        </section>

        {/* Ustawienia gry (obok listy pytań) */}
        <section className="col-span-3 row-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Zarządzanie grą</CardTitle>
              <CardDescription>
                {isGameActive
                  ? "Gra w toku"
                  : isGameEnded
                  ? "Gra zakończona - oczekuje na prowadzącego"
                  : "Gotowy do rozpoczęcia"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status gry */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Status gry:</div>
                <div
                  className={`px-3 py-2 rounded-md text-center ${
                    isGameActive
                      ? "bg-green-100 text-green-800"
                      : isGameEnded
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {isGameActive
                    ? "AKTYWNA"
                    : isGameEnded
                    ? "ZAKOŃCZONA"
                    : "NIEAKTYWNA"}
                </div>
              </div>

              {/* Aktualne pytanie */}
              {(isGameActive || isGameEnded) && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Pytanie:</div>
                  <div className="text-center bg-blue-100 text-blue-800 py-2 rounded-md">
                    {currentQuestionIndex + 1} z {questions.length}
                  </div>
                </div>
              )}

              {/* Aktualna nagroda */}
              {(isGameActive || isGameEnded) && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    {isGameEnded ? "Gracz wygrywa:" : "Aktualna nagroda:"}
                  </div>
                  <div className="text-lg font-bold text-center bg-yellow-100 text-yellow-800 py-2 rounded-md">
                    {isGameEnded ? getWinningPrize() : getCurrentPrize()}
                  </div>
                </div>
              )}

              {/* Koła ratunkowe */}
              {isGameActive && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Koła ratunkowe:</div>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant={
                        usedLifelines.fiftyFifty ? "secondary" : "default"
                      }
                      size="sm"
                      disabled={usedLifelines.fiftyFifty || gameLoading}
                      onClick={() => handleUseLifeline("fiftyFifty")}
                      className="text-xs whitespace-normal break-words h-auto py-2"
                    >
                      {usedLifelines.fiftyFifty ? (
                        <span className="line-through">⚖️ 50:50</span>
                      ) : (
                        "⚖️ 50:50"
                      )}
                    </Button>
                    <Button
                      variant={
                        usedLifelines.phoneAFriend ? "secondary" : "default"
                      }
                      size="sm"
                      disabled={usedLifelines.phoneAFriend || gameLoading}
                      onClick={() => handleUseLifeline("phoneAFriend")}
                      className="text-xs whitespace-normal break-words h-auto py-2"
                    >
                      {usedLifelines.phoneAFriend ? (
                        <span className="line-through">📞 Przyjaciel</span>
                      ) : (
                        "📞 Przyjaciel"
                      )}
                    </Button>
                    <Button
                      variant={
                        usedLifelines.askAudience ? "secondary" : "default"
                      }
                      size="sm"
                      disabled={usedLifelines.askAudience || gameLoading}
                      onClick={() => handleUseLifeline("askAudience")}
                      className="text-xs whitespace-normal break-words h-auto py-2"
                    >
                      {usedLifelines.askAudience ? (
                        <span className="line-through">👥 Publiczność</span>
                      ) : (
                        "👥 Publiczność"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Przyciski sterowania */}
              <div className="space-y-2 pt-4 border-t">
                {!isGameActive && !isGameEnded ? (
                  <Button
                    onClick={handleStartGame}
                    disabled={questions.length === 0 || gameLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {gameLoading ? "⏳ Rozpoczynanie..." : "🎮 Rozpocznij grę"}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button
                      onClick={handleEndGame}
                      variant="destructive"
                      disabled={gameLoading}
                      className="w-full"
                    >
                      {gameLoading
                        ? "⏳ Kończenie..."
                        : isGameEnded
                        ? "🛑 Zamknij sesję"
                        : "🛑 Zakończ grę"}
                    </Button>

                    {isGameEnded && (
                      <div className="text-xs text-center p-2 bg-red-50 text-red-700 rounded border">
                        Gra zakończona po niepoprawnej odpowiedzi. Kliknij
                        &quot;Zamknij sesję&quot; aby zakończyć sesję.
                      </div>
                    )}

                    {!isGameEnded && (
                      <div className="text-xs text-gray-500 text-center">
                        Gracz wygrywa: {getWinningPrize()}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Informacje */}
              <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
                <div>💡 Dostępne pytania: {questions.length}</div>
                {!isGameActive && questions.length === 0 && (
                  <div className="text-red-500">
                    ⚠️ Dodaj pytania przed rozpoczęciem gry
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Podgląd aktualnego pytania + opcje odpowiedzi (prawa kolumna, góra) */}
        <section className="col-span-4 row-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Aktualne pytanie</CardTitle>
              <CardDescription>
                {isGameActive
                  ? `Pytanie ${currentQuestionIndex + 1} z ${questions.length}`
                  : isGameEnded
                  ? "Gra zakończona"
                  : "Brak aktywnej gry"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(isGameActive || isGameEnded) && currentQuestion ? (
                <>
                  {/* Treść pytania */}
                  <div className="p-4 bg-blue-50 rounded-lg border">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      Pytanie za {getCurrentPrize()}
                    </h3>
                    <p className="text-blue-800 leading-relaxed break-words">
                      {currentQuestion.content}
                    </p>
                  </div>

                  {/* Odpowiedzi */}
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(currentQuestion.answers).map(
                      ([key, value]) => {
                        const isSelected = selectedAnswer === key;
                        const isCorrect =
                          isAnswerRevealed &&
                          lastAnswerResult &&
                          key === lastAnswerResult.correctAnswer;
                        const isWrong =
                          isAnswerRevealed &&
                          isSelected &&
                          lastAnswerResult &&
                          key !== lastAnswerResult.correctAnswer;

                        let variant:
                          | "default"
                          | "secondary"
                          | "destructive"
                          | "outline" = "outline";
                        let className =
                          "justify-start text-left h-auto py-3 px-4 whitespace-normal break-words min-h-[3rem]";

                        if (isCorrect) {
                          variant = "default";
                          className +=
                            " bg-green-100 border-green-500 text-green-800 hover:bg-green-100";
                        } else if (isWrong) {
                          variant = "destructive";
                          className +=
                            " bg-red-100 border-red-500 text-red-800";
                        } else if (isSelected) {
                          variant = "secondary";
                          className +=
                            " bg-blue-100 border-blue-500 text-blue-800";
                        }

                        return (
                          <Button
                            key={key}
                            variant={variant}
                            className={className}
                            disabled={
                              gameLoading || isAnswerRevealed || isGameEnded
                            }
                            onClick={() => handleSelectAnswer(key)}
                          >
                            <span className="font-bold mr-3 flex-shrink-0">
                              {key}:
                            </span>
                            <span className="flex-1 break-words leading-relaxed">
                              {value}
                            </span>
                            {isCorrect && (
                              <span className="ml-2 flex-shrink-0">✓</span>
                            )}
                            {isWrong && (
                              <span className="ml-2 flex-shrink-0">✗</span>
                            )}
                          </Button>
                        );
                      }
                    )}
                  </div>

                  {/* Przycisk potwierdzający odpowiedź */}
                  {selectedAnswer &&
                    !isAnswerRevealed &&
                    !gameLoading &&
                    !isGameEnded && (
                      <div className="text-center space-y-3">
                        <div className="text-sm text-blue-700 font-medium">
                          Zaznaczona odpowiedź:{" "}
                          <strong>{selectedAnswer}</strong>
                        </div>
                        <div className="flex flex-col xl:flex-row gap-2 w-full">
                          <Button
                            onClick={handleConfirmAnswer}
                            className="bg-green-600 hover:bg-green-700 text-white flex-1 px-4 py-3 text-lg font-semibold"
                            size="lg"
                          >
                            ✅ Potwierdź odpowiedź
                          </Button>
                          <Button
                            onClick={() => setSelectedAnswer(null)}
                            variant="outline"
                            className="flex-1 px-4 py-3 text-lg"
                            size="lg"
                          >
                            ❌ Anuluj
                          </Button>
                        </div>
                      </div>
                    )}

                  {/* Status */}
                  {gameLoading && (
                    <div className="text-center text-sm text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 inline-block mr-2"></div>
                      Przetwarzanie odpowiedzi...
                    </div>
                  )}

                  {isAnswerRevealed && !gameLoading && lastAnswerResult && (
                    <div className="text-center text-sm text-gray-600 break-words">
                      {lastAnswerResult.correct ? (
                        lastAnswerResult.gameWon ? (
                          <span className="text-green-600 font-semibold">
                            Gracz wygrał całą grę!
                          </span>
                        ) : (
                          <span className="text-green-600">
                            Poprawnie! Przejście do następnego pytania za{" "}
                            {AUTO_PROGRESS_TIME}s...
                          </span>
                        )
                      ) : (
                        <span className="text-red-600">
                          Niepoprawna odpowiedź! Gra zakończona. Prowadzący może
                          zamknąć sesję.
                        </span>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  {isGameEnded
                    ? "Gra zakończona - wyświetlane jest ostatnie pytanie"
                    : isGameActive
                    ? "Ładowanie pytania..."
                    : "Rozpocznij grę aby zobaczyć pytania"}
                </div>
              )}
            </CardContent>
          </Card>
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

      {/* Confirm Dialog */}
      {dialog}
    </div>
  );
}
