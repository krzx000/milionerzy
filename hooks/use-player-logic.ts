"use client";

import * as React from "react";
import { usePlayerState } from "@/hooks/use-player-state";
import { useSound } from "@/hooks/use-sound";
import { useTransitions } from "@/hooks/use-transitions";
import { PlayerAPI } from "@/lib/api/player";
import { PLAYER_CONSTANTS } from "@/lib/constants/player";
import { formatLogData } from "@/lib/utils/player";
import { type AnswerKey } from "@/lib/utils/game-assets";
import type { ConnectionState } from "@/lib/constants/player";

export function usePlayerLogic() {
  // Hook ze stanem gry
  const playerState = usePlayerState();
  // Hook do zarządzania transitions
  const transitions = useTransitions();
  const {
    // Stan gry
    session,
    currentQuestion,
    questionIndex,
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
    // Animacje
    showQuestionAnimation,
    // Historia
    // Funkcje pomocnicze
    isConnected,
  } = playerState;

  // Hook do dźwięków
  const soundControls = useSound();
  const {
    playAnswerSoundWithFade,
    playWinSoundWithFade,
    playLoseSoundWithFade,
    playStartSoundWithFade,
    playLightsDown,
    stopAll,
  } = soundControls;

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

      // Rozpocznij transition z czasem 3200ms
      // Callback wykona się po 1600ms (w połowie), transition kończy się po 3200ms
      transitions.showTransitionWithCallback(
        () => {
          console.log(
            "Player: Callback w połowie transition - pokazywanie pytania"
          );
          setShowGameContent(true);
        },
        "Gra się rozpoczyna!",
        3200
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
    if (currentQuestion && showQuestionAnimation && questionIndex >= 0) {
      console.log("Nowe pytanie - odtwarzanie dźwięku startowego z fade");
      playStartSoundWithFade(questionIndex + 1);
    }
  }, [
    currentQuestion,
    showQuestionAnimation,
    questionIndex,
    playStartSoundWithFade,
  ]);

  // Dźwięk wyboru odpowiedzi
  React.useEffect(() => {
    if (selectedAnswer && !isAnswerRevealed) {
      console.log("Wybrano odpowiedź - odtwarzanie dźwięku z fade");
      playAnswerSoundWithFade();
    }
  }, [selectedAnswer, isAnswerRevealed, playAnswerSoundWithFade]);

  // Dźwięki wyników
  React.useEffect(() => {
    if (isAnswerRevealed && selectedAnswer && correctAnswer) {
      const isCorrect = selectedAnswer === correctAnswer;
      console.log("Ujawniono odpowiedź - odtwarzanie dźwięków");

      playLightsDown();

      setTimeout(() => {
        if (isCorrect) {
          console.log("Poprawna odpowiedź - dźwięk wygranej z fade");
          playWinSoundWithFade(questionIndex + 1);
        } else {
          console.log("Niepoprawna odpowiedź - dźwięk przegranej z fade");
          playLoseSoundWithFade(questionIndex + 1);
        }
      }, 1000);
    }
  }, [
    isAnswerRevealed,
    selectedAnswer,
    correctAnswer,
    questionIndex,
    playWinSoundWithFade,
    playLoseSoundWithFade,
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

    // Sound controls
    ...soundControls,
  };
}
