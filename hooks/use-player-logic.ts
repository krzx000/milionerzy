"use client";

import * as React from "react";
import { usePlayerState } from "@/hooks/use-player-state";
import { useSound } from "@/hooks/use-sound";
import { useSounds } from "@/hooks/use-sounds";
import { useTransitions } from "@/hooks/use-transitions";
import { PlayerAPI } from "@/lib/api/player";
import { PLAYER_CONSTANTS } from "@/lib/constants/player";
import { TRANSITION_CONSTANTS } from "@/lib/constants/transitions";
import { formatLogData } from "@/lib/utils/utils";
import { type AnswerKey } from "@/lib/utils/game-assets";
import type { ConnectionState } from "@/lib/constants/player";

export function usePlayerLogic() {
  // Hook ze stanem gry
  const playerState = usePlayerState();
  // Hook do zarządzania transitions
  const transitions = useTransitions();

  // Hook do dźwięków (event-based)
  const sounds = useSounds();
  const { playResultSequence, stopAllSounds, playStartSound, playAnswerSound } =
    sounds;

  // Hook do dźwięków (legacy - nadal potrzebny dla komponentu)
  useSound();

  const {
    // Stan gry
    session,
    currentQuestion,
    questionIndex,
    totalQuestions,
    currentPrize,
    gameStatus,
    // Stan odpowiedzi
    selectedAnswer,
    correctAnswer,
    isAnswerRevealed,
    showFinalAnswer,
    // Timer
    // Wyniki
    winnings,
    // Koła ratunkowe
    lifelinesUsed,
    hiddenAnswers,
    // Historia
    // Funkcje pomocnicze
    isConnected,
  } = playerState;

  // Stan lokalny dla połączenia
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [connectionStatus, setConnectionStatus] =
    React.useState<ConnectionState>(
      PLAYER_CONSTANTS.CONNECTION_STATES.CONNECTING
    );

  // Stan dla wyników koła ratunkowego (które odpowiedzi pokazać po 50:50)
  const [lifelineResult, setLifelineResult] = React.useState<AnswerKey[]>([
    "A",
    "B",
    "C",
    "D",
  ]);

  // Stan dla automatycznego przejścia do ekranu wygranej po błędnej odpowiedzi
  const [showWinScreen, setShowWinScreen] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  // Ref do śledzenia czy animacja wygranej już została uruchomiona
  const winAnimationTriggered = React.useRef(false);

  // Obliczenia pomocnicze
  const total = React.useMemo(
    () => (typeof totalQuestions === "number" ? totalQuestions : 12),
    [totalQuestions]
  );
  const isLastQuestion = React.useMemo(
    () => questionIndex + 1 >= total,
    [questionIndex, total]
  );
  const isFullWin =
    gameStatus === "ended" &&
    isAnswerRevealed &&
    showFinalAnswer &&
    !!selectedAnswer &&
    !!correctAnswer &&
    selectedAnswer === correctAnswer &&
    isLastQuestion;

  // Flags for tracking shown transitions
  const [hasShownGameStartTransition, setHasShownGameStartTransition] =
    React.useState(false);
  const [hasShownSessionClosedTransition, setHasShownSessionClosedTransition] =
    React.useState(false);
  const [showGameContent, setShowGameContent] = React.useState(false);

  // Tekst wyświetlany w polu pytania: normalne pytanie lub kwota wygranej
  const displayQuestionText = showWinScreen
    ? selectedAnswer === correctAnswer
      ? currentPrize
      : winnings || "0 zł"
    : currentQuestion?.content;

  // ============== EFEKTY I LOGIKA ==============

  // Inicjalizacja połączenia
  React.useEffect(() => {
    const initializeConnection = async () => {
      console.log("Player: Rozpoczynanie inicjalizacji połączenia...");
      try {
        const pingResult = await PlayerAPI.ping();
        console.log("Player: Odpowiedź ping:", pingResult);

        if (pingResult.success) {
          setConnectionStatus(PLAYER_CONSTANTS.CONNECTION_STATES.CONNECTED);
          console.log("Player: Połączenie ustanowione");
        } else {
          console.error(
            "Player: Ping zakończony niepowodzeniem:",
            pingResult.error
          );
          setConnectionStatus(PLAYER_CONSTANTS.CONNECTION_STATES.ERROR);
        }
      } catch (error) {
        console.error("Player: Błąd inicjalizacji połączenia gracza:", error);
        setConnectionStatus(PLAYER_CONSTANTS.CONNECTION_STATES.ERROR);
      } finally {
        setIsInitialized(true);
        console.log("Player: Inicjalizacja zakończona");
      }
    };

    initializeConnection();
  }, []);

  // Aktualizacja statusu połączenia na podstawie SSE
  React.useEffect(() => {
    if (isConnected) {
      setConnectionStatus(PLAYER_CONSTANTS.CONNECTION_STATES.CONNECTED);
    } else if (isInitialized) {
      setConnectionStatus(PLAYER_CONSTANTS.CONNECTION_STATES.DISCONNECTED);
    }
  }, [isConnected, isInitialized]);

  // Przejście z oczekiwania do pierwszego pytania
  React.useEffect(() => {
    if (
      gameStatus === "active" &&
      currentQuestion &&
      questionIndex === 0 &&
      !hasShownGameStartTransition
    ) {
      console.log("Player: Rozpoczynanie przejścia do pierwszego pytania");
      setHasShownGameStartTransition(true);
      setShowGameContent(false);

  // Rozpocznij transition ze zdefiniowanym czasem (DEFAULT)
  // Callback wykona się w połowie, transition kończy się po czasie
      transitions.showTransitionWithCallback(
        () => {
          console.log(
            "Player: Callback w połowie transition - pokazywanie pytania"
          );
          setShowGameContent(true);
        },
        TRANSITION_CONSTANTS.DURATIONS.DEFAULT
      );
    }
  }, [
    gameStatus,
    currentQuestion,
    questionIndex,
    hasShownGameStartTransition,
    transitions,
  ]);

  // Przejście po zamknięciu sesji przez admina
  React.useEffect(() => {
    if (
      gameStatus === "waiting" &&
      !session &&
      !hasShownGameStartTransition &&
      !hasShownSessionClosedTransition
    ) {
      console.log(
        "Player: Rozpoczynanie przejścia po zamknięciu sesji przez admina"
      );
      setHasShownSessionClosedTransition(true);
      transitions.showSessionClosedTransition();
    }
  }, [
    gameStatus,
    session,
    hasShownGameStartTransition,
    hasShownSessionClosedTransition,
    transitions,
  ]);

  // Dźwięk startowy przy nowym pytaniu
  React.useEffect(() => {
    if (currentQuestion && questionIndex >= 0 && gameStatus === "active") {
      console.log("Nowe pytanie - odtwarzanie dźwięku startowego z fade");
      playStartSound(questionIndex + 1);
    }
  }, [currentQuestion, questionIndex, gameStatus, playStartSound]);

  // Dźwięk wyboru odpowiedzi
  React.useEffect(() => {
    if (selectedAnswer && !isAnswerRevealed && gameStatus === "active") {
      console.log("Wybrano odpowiedź - odtwarzanie dźwięku z fade");
      playAnswerSound();
    }
  }, [selectedAnswer, isAnswerRevealed, gameStatus, playAnswerSound]);

  // Dźwięki wyników - odtwarzaj gdy odpowiedź zostanie ujawniona
  React.useEffect(() => {
    if (isAnswerRevealed && selectedAnswer && correctAnswer) {
      const isCorrect = selectedAnswer === correctAnswer;
      console.log("Ujawniono odpowiedź - odtwarzanie dźwięków", {
        selectedAnswer,
        correctAnswer,
        isCorrect,
        questionIndex: questionIndex + 1,
      });

      // Odtwórz sekwencję dźwięków wyników (zatrzymaj → lights down → win/lose)
      playResultSequence(isCorrect, questionIndex + 1);
    }
  }, [
    isAnswerRevealed,
    selectedAnswer,
    correctAnswer,
    questionIndex,
    playResultSequence,
  ]);

  // Zatrzymaj dźwięki przy zmianie gry lub błędzie
  // Wyjątek: na ostatnim pytaniu nie przerywaj dźwięku – pozwól mu wybrzmieć do końca
  React.useEffect(() => {
    if (gameStatus === "ended" || gameStatus === "waiting") {
      if (isLastQuestion) {
        console.log(
          "Skip stopAllSounds on last question – let the final sound finish"
        );
        return;
      }
      console.log("Gra zakończona/oczekująca - zatrzymywanie dźwięków");
      stopAllSounds();
    }
  }, [gameStatus, isLastQuestion, stopAllSounds]);

  // Zarządzanie wynikami koła ratunkowego 50:50
  React.useEffect(() => {
    if (currentQuestion) {
      if (lifelinesUsed.fiftyFifty && hiddenAnswers.length > 0) {
        const allAnswers: AnswerKey[] = ["A", "B", "C", "D"];
        const visibleAnswers = allAnswers.filter(
          (key) => !hiddenAnswers.includes(key)
        );
        setLifelineResult(visibleAnswers);
      } else {
        setLifelineResult(["A", "B", "C", "D"]);
      }
    }
  }, [
    currentQuestion,
    lifelinesUsed.fiftyFifty,
    hiddenAnswers,
    setLifelineResult,
  ]);

  // Logowanie wydarzeń
  React.useEffect(() => {
    if (gameStatus === "active" && currentQuestion) {
      const logData = formatLogData(
        PLAYER_CONSTANTS.LOG_ACTIONS.QUESTION_VIEWED,
        {
          questionIndex,
          questionId: currentQuestion.id,
          timestamp: new Date(),
        }
      );
      PlayerAPI.sendAction(logData);
    }
  }, [gameStatus, currentQuestion, questionIndex]);

  React.useEffect(() => {
    if (selectedAnswer) {
      const logData = formatLogData(
        PLAYER_CONSTANTS.LOG_ACTIONS.ANSWER_SELECTION_DISPLAYED,
        {
          questionIndex,
          selectedAnswer,
          timestamp: new Date(),
        }
      );
      PlayerAPI.sendAction(logData);
    }
  }, [selectedAnswer, questionIndex]);

  // Reset flagi animacji przy nowym pytaniu
  React.useEffect(() => {
    console.log("Resetting animation flag for new question:", {
      questionIndex,
      currentQuestion: !!currentQuestion,
    });
    winAnimationTriggered.current = false;
  }, [questionIndex, currentQuestion]);

  React.useEffect(() => {
    if (isAnswerRevealed && correctAnswer) {
      const logData = formatLogData(
        PLAYER_CONSTANTS.LOG_ACTIONS.ANSWER_REVEALED_DISPLAYED,
        {
          questionIndex,
          selectedAnswer,
          correctAnswer,
          isCorrect: selectedAnswer === correctAnswer,
          timestamp: new Date(),
        }
      );
      PlayerAPI.sendAction(logData);
    }
  }, [isAnswerRevealed, correctAnswer, selectedAnswer, questionIndex]);

  // Automatyczne przejście do ekranu wygranej po pokazaniu poprawnej odpowiedzi (dla błędnych odpowiedzi)
  React.useEffect(() => {
    if (
      isAnswerRevealed &&
      selectedAnswer &&
      correctAnswer &&
      selectedAnswer !== correctAnswer &&
      !showWinScreen && // Dodajemy warunek żeby nie triggować ponownie
      !winAnimationTriggered.current // Sprawdzamy czy już nie została uruchomiona
    ) {
      console.log(
        "Player: Rozpoczynanie przejścia do ekranu wygranej (błędna odpowiedź)"
      );

      winAnimationTriggered.current = true; // Oznacz że animacja została uruchomiona

      const timer = setTimeout(() => {
        // Użyj nowego transition API
        transitions.showTransitionWithCallback(() => {
          setShowWinScreen(true);
        });
      }, 3000);

      return () => {
        console.log("Player: Anulowanie timera przejścia (błędna odpowiedź)");
        clearTimeout(timer);
      };
    }
  }, [
    isAnswerRevealed,
    selectedAnswer,
    correctAnswer,
    showWinScreen,
    transitions,
  ]);

  // Przejście do ekranu wygranej po wygranej grze
  React.useEffect(() => {
    if (
      isAnswerRevealed &&
      showFinalAnswer &&
      selectedAnswer &&
      correctAnswer &&
      gameStatus === "ended" &&
      selectedAnswer === correctAnswer &&
      !showWinScreen && // Dodajemy warunek żeby nie triggować ponownie
      !winAnimationTriggered.current // Sprawdzamy czy już nie została uruchomiona
    ) {
      console.log(
        "Player: Rozpoczynanie przejścia do ekranu wygranej (wygrana gra)"
      );

      winAnimationTriggered.current = true; // Oznacz że animacja została uruchomiona

      // Użyj nowego transition API
      transitions.showTransitionWithCallback(() => {
        setShowWinScreen(true);
      });
    }
  }, [
    isAnswerRevealed,
    showFinalAnswer,
    selectedAnswer,
    correctAnswer,
    gameStatus,
    showWinScreen,
    transitions,
  ]);

  // Reset stanów przy nowym pytaniu
  React.useEffect(() => {
    if (gameStatus === "active") {
      setShowWinScreen(false);
      setIsTransitioning(false);
      winAnimationTriggered.current = false; // Reset flagi animacji
    }

    if (gameStatus === "waiting" && !hasShownGameStartTransition && session) {
      setHasShownGameStartTransition(false);
      setHasShownSessionClosedTransition(false);
      setShowGameContent(true);
      setShowWinScreen(false);
      setIsTransitioning(false);
      winAnimationTriggered.current = false; // Reset flagi animacji
    }
  }, [questionIndex, gameStatus, hasShownGameStartTransition, session]);

  // Pokazywanie zawartości dla pytań innych niż pierwsze
  React.useEffect(() => {
    if (gameStatus === "active" && currentQuestion && questionIndex > 0) {
      console.log(
        "Player: Pokazywanie zawartości dla pytania",
        questionIndex + 1
      );
      setShowGameContent(true);
    }
  }, [gameStatus, currentQuestion, questionIndex]);

  return {
    // Stan z usePlayerState
    ...playerState,

    // Stan lokalny
    isInitialized,
    connectionStatus,
    lifelineResult,
    showWinScreen,
    isTransitioning,
    showGameContent,
    displayQuestionText,
    isFullWin,

    // Sound controls (event-based) - tylko trzy kluczowe momenty
    playStartSound: sounds.playStartSound, // 1. Nowe pytanie
    playAnswerSound: sounds.playAnswerSound, // 2. Zaznaczenie odpowiedzi
    playResultSequence: sounds.playResultSequence, // 3. Efekt zaznaczenia (poprawne/niepoprawne)
    stopAllSounds: sounds.stopAllSounds, // Zatrzymanie (dla cleanup)
  };
}
