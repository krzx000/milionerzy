"use client";

import * as React from "react";
import { usePlayerState } from "@/hooks/use-player-state";
import { useSound } from "@/hooks/use-sound";
import { PlayerAPI } from "@/lib/api/player";
import { PLAYER_CONSTANTS } from "@/lib/constants/player";
import {
  getConnectionStatusText,
  getConnectionStatusEmoji,
  formatLogData,
} from "@/lib/utils/player";
import {
  getAnswerRowBackground,
  IMAGES,
  type AnswerKey,
  type LifelineType,
} from "@/lib/utils/game-assets";
import type { ConnectionState } from "@/lib/constants/player";
import useFitText from "use-fit-text";

export function usePlayerLogic() {
  // Hook ze stanem gry
  const playerState = usePlayerState();
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
    answerLocked,
    showFinalAnswer,
    // Timer
    timeRemaining,
    // Wyniki
    winnings,
    finalResult,
    // Koła ratunkowe
    lifelinesUsed,
    hiddenAnswers,
    audienceVotingActive,
    // Animacje
    showQuestionAnimation,
    showAnswerAnimation,
    showTransitionScreen,
    // Historia
    answerHistory,
    // Funkcje pomocnicze
    isConnected,
    formatTime,
    isAnswerHidden,
    getAnswerClass,
  } = playerState;

  // Hook do dźwięków
  const soundControls = useSound();
  const {
    playAnswerSound,
    playWinSound,
    playLoseSound,
    playStartSound,
    playLightsDown,
    stopAll,
  } = soundControls;

  // Wielkości czcionek
  const { fontSize: questionFontSize, ref: questionRef } = useFitText({
    maxFontSize: 270,
    minFontSize: 50,
  });

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
  const [showWinTransition, setShowWinTransition] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  // Stany dla przejść między ekranami
  const [isGameStartTransition, setIsGameStartTransition] =
    React.useState(false);
  const [isBackToWaitingTransition, setIsBackToWaitingTransition] =
    React.useState(false);
  const [isSessionClosedTransition, setIsSessionClosedTransition] =
    React.useState(false);
  const [hasShownGameStartTransition, setHasShownGameStartTransition] =
    React.useState(false);
  const [hasShownSessionClosedTransition, setHasShownSessionClosedTransition] =
    React.useState(false);
  const [showGameContent, setShowGameContent] = React.useState(false);

  // Globalny stan blokady przejść - zapobiega nakładaniu się animacji
  const [isAnyTransitionActive, setIsAnyTransitionActive] =
    React.useState(false);

  // Tekst wyświetlany w polu pytania: normalne pytanie lub kwota wygranej
  const displayQuestionText = showWinScreen
    ? selectedAnswer === correctAnswer
      ? currentPrize
      : winnings || "0 zł"
    : currentQuestion?.content;

  // ============== EFEKTY I LOGIKA ==============

  // Monitorowanie globalnej blokady przejść
  React.useEffect(() => {
    const anyTransitionActive =
      isTransitioning ||
      showWinTransition ||
      isGameStartTransition ||
      isBackToWaitingTransition ||
      isSessionClosedTransition;

    setIsAnyTransitionActive(anyTransitionActive);

    if (anyTransitionActive) {
      console.log(
        "Player: Transition lock activated - blocking other transitions"
      );
    } else {
      console.log("Player: Transition lock released - transitions available");
    }
  }, [
    isTransitioning,
    showWinTransition,
    isGameStartTransition,
    isBackToWaitingTransition,
    isSessionClosedTransition,
  ]);

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
      !hasShownGameStartTransition &&
      !isAnyTransitionActive
    ) {
      console.log("Player: Rozpoczynanie przejścia do pierwszego pytania");
      setHasShownGameStartTransition(true);
      setShowGameContent(false);
      setIsGameStartTransition(true);

      setTimeout(() => {
        setShowGameContent(true);
      }, 1500);

      setTimeout(() => {
        setIsGameStartTransition(false);
      }, 2000);
    }
  }, [
    gameStatus,
    currentQuestion,
    questionIndex,
    hasShownGameStartTransition,
    isAnyTransitionActive,
  ]);

  // Automatyczne przejście z ekranu wygranej do oczekiwania po 5 sekundach
  React.useEffect(() => {
    if (
      gameStatus === "ended" &&
      finalResult === "win" &&
      showWinScreen &&
      !isBackToWaitingTransition &&
      !isAnyTransitionActive
    ) {
      console.log(
        "Player: Ustawianie timera przejścia z wygranej do oczekiwania"
      );
      const timer = setTimeout(() => {
        console.log(
          "Player: Rozpoczynanie przejścia z wygranej do oczekiwania"
        );
        setIsBackToWaitingTransition(true);

        setTimeout(() => {
          setIsBackToWaitingTransition(false);
        }, 2000);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [
    gameStatus,
    finalResult,
    showWinScreen,
    isBackToWaitingTransition,
    isAnyTransitionActive,
  ]);

  // Przejście po zamknięciu sesji przez admina
  React.useEffect(() => {
    if (
      gameStatus === "waiting" &&
      !session &&
      !isSessionClosedTransition &&
      !isBackToWaitingTransition &&
      !hasShownGameStartTransition &&
      !hasShownSessionClosedTransition &&
      !isAnyTransitionActive
    ) {
      console.log(
        "Player: Rozpoczynanie przejścia po zamknięciu sesji przez admina"
      );
      setHasShownSessionClosedTransition(true);
      setIsSessionClosedTransition(true);

      setTimeout(() => {
        setIsSessionClosedTransition(false);
      }, 2000);
    }
  }, [
    gameStatus,
    session,
    isSessionClosedTransition,
    isBackToWaitingTransition,
    hasShownGameStartTransition,
    hasShownSessionClosedTransition,
    isAnyTransitionActive,
  ]);

  // Dźwięk startowy przy nowym pytaniu
  React.useEffect(() => {
    if (currentQuestion && showQuestionAnimation && questionIndex >= 0) {
      console.log("Nowe pytanie - odtwarzanie dźwięku startowego");
      playStartSound(questionIndex + 1);
    }
  }, [currentQuestion, showQuestionAnimation, questionIndex, playStartSound]);

  // Dźwięk wyboru odpowiedzi
  React.useEffect(() => {
    if (selectedAnswer && !isAnswerRevealed) {
      console.log("Wybrano odpowiedź - odtwarzanie dźwięku");
      playAnswerSound();
    }
  }, [selectedAnswer, isAnswerRevealed, playAnswerSound]);

  // Dźwięki wyników
  React.useEffect(() => {
    if (isAnswerRevealed && selectedAnswer && correctAnswer) {
      const isCorrect = selectedAnswer === correctAnswer;
      console.log("Ujawniono odpowiedź - odtwarzanie dźwięków");

      playLightsDown();

      setTimeout(() => {
        if (isCorrect) {
          console.log("Poprawna odpowiedź - dźwięk wygranej");
          playWinSound();
        } else {
          console.log("Niepoprawna odpowiedź - dźwięk przegranej");
          playLoseSound();
        }
      }, 1000);
    }
  }, [
    isAnswerRevealed,
    selectedAnswer,
    correctAnswer,
    playWinSound,
    playLoseSound,
    playLightsDown,
  ]);

  // Zatrzymaj dźwięki przy zmianie gry lub błędzie
  React.useEffect(() => {
    if (gameStatus === "ended" || gameStatus === "waiting") {
      console.log("Gra zakończona/oczekująca - zatrzymywanie dźwięków");
      stopAll();
    }
  }, [gameStatus, stopAll]);

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
      !isAnyTransitionActive
    ) {
      const timer = setTimeout(() => {
        console.log(
          "Player: Rozpoczynanie przejścia do ekranu wygranej (błędna odpowiedź)"
        );
        setIsTransitioning(true);

        setTimeout(() => {
          setShowWinTransition(true);
        }, 300);

        setTimeout(() => {
          setShowWinScreen(true);
        }, 500);

        setTimeout(() => {
          setShowWinTransition(false);
          setIsTransitioning(false);
        }, 3200);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isAnswerRevealed, selectedAnswer, correctAnswer, isAnyTransitionActive]);

  // Przejście do ekranu wygranej po wygranej grze
  React.useEffect(() => {
    if (
      isAnswerRevealed &&
      showFinalAnswer &&
      selectedAnswer &&
      correctAnswer &&
      gameStatus === "ended" &&
      selectedAnswer === correctAnswer &&
      !isAnyTransitionActive
    ) {
      console.log(
        "Player: Rozpoczynanie przejścia do ekranu wygranej (wygrana gra)"
      );
      setIsTransitioning(true);

      setTimeout(() => {
        setShowWinTransition(true);
      }, 300);

      setTimeout(() => {
        setShowWinScreen(true);
      }, 500);

      setTimeout(() => {
        setShowWinTransition(false);
        setIsTransitioning(false);
      }, 3200);
    }
  }, [
    isAnswerRevealed,
    showFinalAnswer,
    selectedAnswer,
    correctAnswer,
    gameStatus,
    isAnyTransitionActive,
  ]);

  // Reset stanów przy nowym pytaniu
  React.useEffect(() => {
    if (gameStatus === "active") {
      setShowWinScreen(false);
      setShowWinTransition(false);
      setIsTransitioning(false);
    }

    if (gameStatus === "waiting" && !hasShownGameStartTransition && session) {
      setIsGameStartTransition(false);
      setHasShownGameStartTransition(false);
      setHasShownSessionClosedTransition(false);
      setShowGameContent(true);
      setShowWinScreen(false);
      setShowWinTransition(false);
      setIsTransitioning(false);
      setIsBackToWaitingTransition(false);
      setIsSessionClosedTransition(false);
    }

    if (gameStatus === "ended") {
      setIsBackToWaitingTransition(false);
    }
  }, [
    questionIndex,
    gameStatus,
    isGameStartTransition,
    hasShownGameStartTransition,
    session,
  ]);

  // Ukrywanie zawartości gry na początku (zapobieganie flashowi)
  React.useEffect(() => {
    if (
      gameStatus === "active" &&
      currentQuestion &&
      questionIndex === 0 &&
      !hasShownGameStartTransition &&
      !isAnyTransitionActive
    ) {
      console.log(
        "Player: Ukrywanie zawartości przed przejściem (zapobieganie flashowi)"
      );
      setShowGameContent(false);
    }
  }, [
    gameStatus,
    currentQuestion,
    questionIndex,
    hasShownGameStartTransition,
    isAnyTransitionActive,
  ]);

  // Pokazywanie zawartości dla pytań innych niż pierwsze
  React.useEffect(() => {
    if (
      gameStatus === "active" &&
      currentQuestion &&
      questionIndex > 0 &&
      !isAnyTransitionActive
    ) {
      console.log(
        "Player: Pokazywanie zawartości dla pytania",
        questionIndex + 1
      );
      setShowGameContent(true);
    }
  }, [gameStatus, currentQuestion, questionIndex, isAnyTransitionActive]);

  return {
    // Stan z usePlayerState
    ...playerState,

    // Stan lokalny
    isInitialized,
    connectionStatus,
    lifelineResult,
    showWinScreen,
    showWinTransition,
    isTransitioning,
    isGameStartTransition,
    isBackToWaitingTransition,
    isSessionClosedTransition,
    showGameContent,
    displayQuestionText,

    // Utility
    questionFontSize,
    questionRef,

    // Sound controls
    ...soundControls,
  };
}
