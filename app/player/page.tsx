/* eslint-disable @typescript-eslint/no-unused-vars */
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
import Image from "next/image";
import useFitText from "use-fit-text";
import { Badge } from "@/components/ui/badge";
import { ConnectionBadge } from "@/components/ui/connection-badge";
import { WaitingScreen } from "@/components/views/WaitingScreen";
import { WinScreen } from "@/components/views/WinScreen";
import { WinTransitionScreen } from "@/components/views/WinTransitionScreen";
import { LifelinesDisplay } from "@/components/views/LifelinesDisplay";
import { AudienceVotingModal } from "@/components/views/AudienceVotingModal";
import { GamePausedModal } from "@/components/views/GamePausedModal";
import { QuestionDisplay } from "@/components/views/QuestionDisplay";
import { AnswersDisplay } from "@/components/views/AnswersDisplay";
import { GameLogo } from "@/components/views/GameLogo";
import { GameTransitionOverlay } from "@/components/ui/game-transition-overlay";
import { ImagePreloader } from "@/components/ui/image-preloader";

export default function PlayerViewPage() {
  // ============== DOSTĘPNE STATE'Y I ZMIENNE ==============

  // Hook ze stanem gry
  const {
    // Stan gry
    session, // Aktualna sesja gry
    currentQuestion, // Aktualne pytanie
    questionIndex, // Indeks pytania (0-based)
    totalQuestions, // Łączna liczba pytań
    currentPrize, // Aktualna nagroda
    gameStatus, // Status gry: "waiting" | "active" | "paused" | "ended"

    // Stan odpowiedzi
    selectedAnswer, // Wybrana odpowiedź (A/B/C/D)
    correctAnswer, // Poprawna odpowiedź (A/B/C/D)
    isAnswerRevealed, // Czy odpowiedź została ujawniona
    answerLocked, // Czy odpowiedź została zatwierdzona
    showFinalAnswer, // Czy pokazać finalne podsumowanie odpowiedzi

    // Timer
    timeRemaining, // Pozostały czas w sekundach

    // Wyniki
    winnings, // Aktualne wygrane
    finalResult, // Końcowy wynik: "win" | "lose"

    // Koła ratunkowe
    lifelinesUsed, // { fiftyFifty: boolean, phoneAFriend: boolean, askAudience: boolean }
    hiddenAnswers, // Ukryte odpowiedzi (50:50)
    audienceVotingActive, // Czy trwa głosowanie publiczności

    // Animacje
    showQuestionAnimation, // Czy pokazać animację pytania
    showAnswerAnimation, // Czy pokazać animację odpowiedzi
    showTransitionScreen, // Czy pokazać ekran przejściowy między pytaniami

    // Historia
    answerHistory, // Historia wszystkich odpowiedzi

    // Funkcje pomocnicze
    isConnected, // Czy połączony z SSE
    formatTime, // Funkcja do formatowania czasu
    isAnswerHidden, // Funkcja sprawdzająca czy odpowiedź jest ukryta (50:50)
    getAnswerClass, // Funkcja zwracająca klasę CSS dla odpowiedzi
  } = usePlayerState();

  // Hook do dźwięków
  const {
    playAnswerSound,
    playWinSound,
    playLoseSound,
    playStartSound,
    playLightsDown,
    stopAll,
  } = useSound();

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
    // Sprawdzamy czy przechodzimy z waiting do active i mamy pierwsze pytanie
    if (
      gameStatus === "active" &&
      currentQuestion &&
      questionIndex === 0 &&
      !hasShownGameStartTransition &&
      !isAnyTransitionActive // Sprawdź czy nie ma aktywnego przejścia
    ) {
      console.log("Player: Rozpoczynanie przejścia do pierwszego pytania");
      setHasShownGameStartTransition(true);
      setShowGameContent(false); // Natychmiast ukryj zawartość
      setIsGameStartTransition(true); // Natychmiast pokaż przejście

      // Po 1.5 sekundy pokazuj zawartość (przed końcem przejścia)
      setTimeout(() => {
        setShowGameContent(true);
      }, 1500);

      // Po 2 sekundach ukrywamy przejście
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
      !isAnyTransitionActive // Sprawdź czy nie ma aktywnego przejścia
    ) {
      console.log(
        "Player: Ustawianie timera przejścia z wygranej do oczekiwania"
      );
      const timer = setTimeout(() => {
        console.log(
          "Player: Rozpoczynanie przejścia z wygranej do oczekiwania"
        );
        setIsBackToWaitingTransition(true);

        // Po 2 sekundach ukrywamy przejście
        setTimeout(() => {
          setIsBackToWaitingTransition(false);
        }, 2000);
      }, 5000); // 5 sekund wyświetlania wyniku

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
    // Sprawdzamy czy przechodzimy z active/ended do waiting (zamknięcie sesji przez admina)
    if (
      gameStatus === "waiting" &&
      !session &&
      !isSessionClosedTransition &&
      !isBackToWaitingTransition && // Nie robimy tego jeśli już jest inne przejście
      !hasShownGameStartTransition && // Nie robimy tego przy rozpoczęciu nowej gry
      !hasShownSessionClosedTransition && // Nie pokazuj ponownie tego samego przejścia
      !isAnyTransitionActive // Sprawdź czy nie ma aktywnego przejścia
    ) {
      console.log(
        "Player: Rozpoczynanie przejścia po zamknięciu sesji przez admina"
      );
      setHasShownSessionClosedTransition(true); // Ustaw flagę żeby nie powtórzyć
      setIsSessionClosedTransition(true);

      // Po 2 sekundach ukrywamy przejście
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

  // Zarządzanie wynikami koła ratunkowego 50:50 - używamy danych z serwera
  React.useEffect(() => {
    if (currentQuestion) {
      if (lifelinesUsed.fiftyFifty && hiddenAnswers.length > 0) {
        // Użyj ukrytych odpowiedzi z serwera - pokaż tylko te, które NIE są ukryte
        const allAnswers: AnswerKey[] = ["A", "B", "C", "D"];
        const visibleAnswers = allAnswers.filter(
          (key) => !hiddenAnswers.includes(key)
        );
        setLifelineResult(visibleAnswers);
      } else {
        // Pokaż wszystkie odpowiedzi
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
      !isAnyTransitionActive // Sprawdź czy nie ma aktywnego przejścia
    ) {
      // Czekamy 3 sekundy po pokazaniu poprawnej odpowiedzi, potem płynnie przechodzimy
      const timer = setTimeout(() => {
        console.log(
          "Player: Rozpoczynanie przejścia do ekranu wygranej (błędna odpowiedź)"
        );
        // Rozpoczynamy płynne przejście
        setIsTransitioning(true);

        // Po 300ms pokazujemy ekran przejściowy
        setTimeout(() => {
          setShowWinTransition(true);
        }, 300);

        // Po kolejnych 200ms pokazujemy zawartość wygranej
        setTimeout(() => {
          setShowWinScreen(true);
        }, 500);

        // Po zakończeniu animacji (3.2s od początku) ukrywamy nakładkę
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
      !isAnyTransitionActive // Sprawdź czy nie ma aktywnego przejścia
    ) {
      // Płynne przejście dla wygranej
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

  // Reset stanów przy nowym pytaniu (ale nie przy gameStatus change)
  React.useEffect(() => {
    if (gameStatus === "active") {
      setShowWinScreen(false);
      setShowWinTransition(false);
      setIsTransitioning(false);
    }

    // Reset stanów przejść przy zmianie stanu gry na waiting (ale tylko jeśli nie ma aktywnego przejścia start)
    if (gameStatus === "waiting" && !hasShownGameStartTransition && session) {
      setIsGameStartTransition(false);
      setHasShownGameStartTransition(false); // Reset flagi dla nowej gry
      setHasShownSessionClosedTransition(false); // Reset flagi zamknięcia sesji dla nowej gry
      setShowGameContent(true); // Pokaż zawartość domyślnie
      setShowWinScreen(false);
      setShowWinTransition(false);
      setIsTransitioning(false);
      setIsBackToWaitingTransition(false); // Reset przejścia z wygranej
      setIsSessionClosedTransition(false); // Reset przejścia po zamknięciu sesji
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
      !isAnyTransitionActive // Sprawdź czy nie ma aktywnego przejścia
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
      !isAnyTransitionActive // Sprawdź czy nie ma aktywnego przejścia
    ) {
      console.log(
        "Player: Pokazywanie zawartości dla pytania",
        questionIndex + 1
      );
      setShowGameContent(true);
    }
  }, [gameStatus, currentQuestion, questionIndex, isAnyTransitionActive]);

  // ============== FUNKCJE POMOCNICZE ==============

  // Funkcja do sprawdzania czy odpowiedź jest ukryta (50:50)
  // ============== RENDER - TUTAJ MOŻESZ ZBUDOWAĆ SWÓJ INTERFEJS ==============

  // Jeśli nie jest jeszcze zainicjalizowane
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Łączenie z grą...</p>
      </div>
    );
  }

  // Jeśli wystąpił błąd połączenia
  if (connectionStatus === PLAYER_CONSTANTS.CONNECTION_STATES.ERROR) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <h2>Błąd połączenia</h2>
        <p>Nie udało się połączyć z serwerem gry.</p>
        <button onClick={() => window.location.reload()}>
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  // Jeśli gra nie została jeszcze rozpoczęta (ale nie podczas przejścia lub gdy gra jest aktywna)
  if (
    (gameStatus === "waiting" || !session) &&
    !isGameStartTransition &&
    !isSessionClosedTransition &&
    gameStatus !== "active"
  ) {
    console.log("Player page: Rendering waiting screen", {
      gameStatus,
      hasSession: !!session,
      hasCurrentQuestion: !!currentQuestion,
    });

    return (
      <WaitingScreen
        isConnected={isConnected}
        isBackToWaitingTransition={isBackToWaitingTransition}
        isSessionClosedTransition={isSessionClosedTransition}
      />
    );
  }

  // Jeśli gra się zakończyła wygraną (tylko gdy gra jest rzeczywiście zakończona)
  if (finalResult === "win" && gameStatus === "ended") {
    console.log("Player page: Game won, rendering win screen", {
      finalResult,
      gameStatus,
    });

    return (
      <WinScreen
        isConnected={isConnected}
        isBackToWaitingTransition={isBackToWaitingTransition}
        winnings={winnings}
      />
    );
  }

  // Jeśli pokazujemy ekran przejściowy do wygranej
  if (showWinTransition) {
    return <WinTransitionScreen />;
  }

  // ============== GŁÓWNY WIDOK GRY - TUTAJ ZBUDUJ SWÓJ INTERFEJS ==============

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${IMAGES.BACKGROUND})` }}
    >
      {/* Status połączenia w prawym górnym rogu */}
      <div className="fixed top-6 right-6 z-50">
        <ConnectionBadge isConnected={isConnected} />
      </div>

      {/* GŁÓWNA ZAWARTOŚĆ GRY */}
      <div
        className={`h-screen flex flex-col justify-end transition-all duration-500 ${
          isTransitioning || isGameStartTransition || isSessionClosedTransition
            ? "opacity-75"
            : "opacity-100"
        }`}
      >
        {/* Logo */}
        <GameLogo
          isTransitioning={isTransitioning}
          isGameStartTransition={isGameStartTransition}
          isSessionClosedTransition={isSessionClosedTransition}
        />

        <QuestionDisplay
          currentQuestion={currentQuestion}
          showGameContent={showGameContent}
          isTransitioning={isTransitioning}
          isGameStartTransition={isGameStartTransition}
          isSessionClosedTransition={isSessionClosedTransition}
          showWinScreen={showWinScreen}
          currentPrize={currentPrize}
          displayQuestionText={displayQuestionText}
        />

        {/* Koła ratunkowe (graficzne) */}
        <LifelinesDisplay
          lifelinesUsed={lifelinesUsed}
          showGameContent={showGameContent}
          showWinScreen={showWinScreen}
          isTransitioning={isTransitioning}
          isGameStartTransition={isGameStartTransition}
          isSessionClosedTransition={isSessionClosedTransition}
        />

        <div></div>

        {/* Odpowiedzi */}
        {currentQuestion && (
          <AnswersDisplay
            currentQuestion={currentQuestion}
            questionIndex={questionIndex}
            showGameContent={showGameContent}
            showWinScreen={showWinScreen}
            isTransitioning={isTransitioning}
            isGameStartTransition={isGameStartTransition}
            isSessionClosedTransition={isSessionClosedTransition}
            selectedAnswer={selectedAnswer}
            correctAnswer={correctAnswer}
            isAnswerRevealed={isAnswerRevealed}
            lifelineResult={lifelineResult}
          />
        )}

        {/* Stan głosowania publiczności */}
        <AudienceVotingModal isActive={audienceVotingActive} />

        {/* Stan pauzy */}
        <GamePausedModal isPaused={gameStatus === "paused"} />

        {/* Preloadowanie wszystkich obrazków tła odpowiedzi */}
        <ImagePreloader />
      </div>

      {/* TRANSITION OVERLAYS */}
      <GameTransitionOverlay
        isVisible={showTransitionScreen}
        logoAlt="Logo Milionerzy - Przejście między pytaniami"
      />
      <GameTransitionOverlay
        isVisible={isBackToWaitingTransition && showWinScreen}
        logoAlt="Logo Milionerzy - Przejście z wygranej"
      />
      <GameTransitionOverlay
        isVisible={isSessionClosedTransition && !showWinScreen}
        logoAlt="Logo Milionerzy - Zamknięcie sesji"
      />
      <GameTransitionOverlay
        isVisible={isGameStartTransition}
        logoAlt="Logo Milionerzy - Start gry"
      />
    </div>
  );
}
