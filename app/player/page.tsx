/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import { usePlayerState } from "@/hooks/use-player-state";
import { useSound } from "@/hooks/use-sound";
import { PlayerAPI } from "@/lib/api/player";
import { PLAYER_CONSTANTS } from "@/lib/constants/player";
import { Coiny, Inter } from "next/font/google";

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
import { WaitingScreen } from "@/components/views/WaitingScreen";
import { Wifi, WifiOff } from "lucide-react";

const COINY = Coiny({
  subsets: ["latin"],
  weight: ["400"],
});

const INTER = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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

  const { fontSize: prizeFontSize, ref: prizeRef } = useFitText({
    maxFontSize: 150,
    minFontSize: 50,
  });

  const { fontSize: answerAFontSize, ref: answerARef } = useFitText({
    maxFontSize: 200,
    minFontSize: 50,
  });

  const { fontSize: answerBFontSize, ref: answerBRef } = useFitText({
    maxFontSize: 200,
    minFontSize: 50,
  });

  const { fontSize: answerCFontSize, ref: answerCRef } = useFitText({
    maxFontSize: 200,
    minFontSize: 50,
  });

  const { fontSize: answerDFontSize, ref: answerDRef } = useFitText({
    maxFontSize: 200,
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
  const isAnswerVisible = (key: AnswerKey): boolean => {
    return lifelineResult.includes(key);
  };

  // Funkcja do pobierania stanu odpowiedzi
  const getAnswerState = (
    key: AnswerKey
  ): "default" | "selected" | "correct" => {
    // Pierwszeństwo ma ujawniona poprawna odpowiedź
    if (isAnswerRevealed && correctAnswer === key) return "correct";
    // Jeśli odpowiedź jest zaznaczona (niezależnie od tego czy jest ujawniona czy nie)
    if (selectedAnswer === key) return "selected";
    return "default";
  };

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
      <div
        className="min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: `url(${IMAGES.BACKGROUND})` }}
      >
        {/* Status połączenia w prawym górnym rogu */}
        <div className="fixed top-6 right-6 z-50">
          {isConnected ? (
            <Badge variant="default" className="bg-green-500 text-white">
              <Wifi className="w-4 h-4 mr-1" />
              Połączono
            </Badge>
          ) : (
            <Badge variant="destructive" className="bg-red-500 text-white">
              <WifiOff className="w-4 h-4 mr-1" />
              Rozłączono
            </Badge>
          )}
        </div>

        {/* EKRAN WYGRANEJ */}
        <div
          className={`h-screen flex flex-col justify-end transition-all duration-500 ${
            isBackToWaitingTransition ? "opacity-75" : "opacity-100"
          }`}
        >
          {/* Logo w tym samym miejscu */}
          <div className="flex justify-center">
            <Image
              src={IMAGES.LOGO}
              alt="Logo"
              width={512}
              height={512}
              draggable={false}
              className={`w-1/4 select-none transition-all duration-500 ${
                isBackToWaitingTransition ? "opacity-50" : "opacity-100"
              }`}
            />
          </div>

          {/* Obszar pytania teraz z wygraną */}
          <div
            className={`relative transition-all duration-500 ease-in-out bg-cover bg-center bg-no-repeat ${
              isBackToWaitingTransition ? "opacity-75" : "opacity-100"
            }`}
            style={{
              backgroundImage: `url(${IMAGES.QUESTION_BACKGROUND})`,
            }}
          >
            {/* Niewidoczny obrazek dla wymiarów */}
            <Image
              src={IMAGES.QUESTION_BACKGROUND}
              width={1920}
              height={400}
              alt="Wygrana"
              className="w-full invisible"
              draggable={false}
            />

            {/* Napis "WYGRANA" gdzie była nagroda */}
            <div className="absolute top-[31%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-[9%] h-[15%] flex items-center justify-center">
              <p
                style={{ ...COINY.style }}
                className="text-white text-center text-shadow-bold text-2xl font-bold"
              >
                WYGRANA
              </p>
            </div>

            {/* Kwota wygranej gdzie było pytanie */}
            <div
              ref={questionRef}
              className="absolute top-[55%] -translate-y-1/2 h-[40%] left-1/2 -translate-x-1/2 w-[76%] flex items-center justify-center"
            >
              <p
                style={{ ...INTER.style, fontSize: questionFontSize }}
                className="text-white text-center font-bold text-shadow-bold"
              >
                {winnings || "1 000 000 zł"}
              </p>
            </div>
          </div>

          {/* Koła ratunkowe (nieaktywne) */}
          <div className="flex justify-center gap-4">
            <Image
              src={IMAGES.LIFELINES_BACKGROUND.FIFTY_FIFTY.USED}
              alt="Koło ratunkowe 50:50"
              width={512}
              height={512}
              draggable={false}
              className="w-[120px] h-auto select-none opacity-50"
              priority
            />
            <Image
              src={IMAGES.LIFELINES_BACKGROUND.VOTING.USED}
              alt="Koło ratunkowe - pytanie do publiczności"
              width={512}
              height={512}
              draggable={false}
              className="w-[120px] h-auto select-none opacity-50"
              priority
            />
            <Image
              src={IMAGES.LIFELINES_BACKGROUND.PHONE.USED}
              alt="Koło ratunkowe - telefon do przyjaciela"
              width={512}
              height={512}
              draggable={false}
              className="w-[120px] h-auto select-none opacity-50"
              priority
            />
          </div>

          <div></div>

          {/* Miejsce odpowiedzi - puste lub gratulacje */}
          <div className="-space-y-8 relative">
            <div
              className="relative transition-all duration-500 ease-in-out bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${IMAGES.ANSWER_BACKGROUNDS.DEFAULT_DEFAULT})`,
              }}
            >
              <Image
                src={IMAGES.ANSWER_BACKGROUNDS.DEFAULT_DEFAULT}
                width={1920}
                height={150}
                alt="Gratulacje"
                className="w-full invisible"
                draggable={false}
              />

              {/* Gratulacje */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p
                  style={{ ...INTER.style }}
                  className="text-white text-4xl font-bold text-shadow-bold text-center"
                >
                  🎉 GRATULACJE! 🎉
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ekran przejściowy z wygranej do oczekiwania */}
        {isBackToWaitingTransition && (
          <div className="fixed inset-0 z-[9999] transition-screen-overlay backdrop-blur-2xl bg-black/20">
            <div className="min-h-screen flex items-center justify-center">
              <div className="transition-screen-logo">
                <Image
                  src={IMAGES.LOGO}
                  alt="Logo Milionerzy"
                  width={600}
                  height={300}
                  className="drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Jeśli pokazujemy ekran przejściowy do wygranej
  if (showWinTransition) {
    return (
      <div
        className="min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: `url(${IMAGES.BACKGROUND})` }}
      >
        {/* EKRAN PRZEJŚCIOWY DO WYGRANEJ */}
        <div className="fixed inset-0 z-[9999] transition-screen-overlay backdrop-blur-2xl bg-black/20">
          <div className="min-h-screen flex items-center justify-center">
            <div className="transition-screen-logo">
              <Image
                src={IMAGES.LOGO}
                alt="Logo Milionerzy"
                width={600}
                height={300}
                className="drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============== GŁÓWNY WIDOK GRY - TUTAJ ZBUDUJ SWÓJ INTERFEJS ==============

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${IMAGES.BACKGROUND})` }}
    >
      {/* Status połączenia w prawym górnym rogu */}
      <div className="fixed top-6 right-6 z-50">
        {isConnected ? (
          <Badge variant="default" className="bg-green-500 text-white">
            <Wifi className="w-4 h-4 mr-1" />
            Połączono
          </Badge>
        ) : (
          <Badge variant="destructive" className="bg-red-500 text-white">
            <WifiOff className="w-4 h-4 mr-1" />
            Rozłączono
          </Badge>
        )}
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
        <div className="flex justify-center">
          <Image
            src={IMAGES.LOGO}
            alt="Logo"
            width={512}
            height={512}
            draggable={false}
            className={`w-1/4 select-none transition-all duration-500 ${
              isTransitioning ||
              isGameStartTransition ||
              isSessionClosedTransition
                ? "opacity-50"
                : "opacity-100"
            }`}
            id="main-logo"
          />
        </div>

        {currentQuestion && (
          <div
            className={`relative transition-all duration-500 ease-in-out bg-cover bg-center bg-no-repeat ${
              !showGameContent
                ? "opacity-0"
                : isTransitioning ||
                  isGameStartTransition ||
                  isSessionClosedTransition
                ? "opacity-75"
                : "opacity-100"
            }`}
            style={{
              backgroundImage: `url(${IMAGES.QUESTION_BACKGROUND})`,
            }}
          >
            {/* Niewidoczny obrazek dla wymiarów */}
            <Image
              src={IMAGES.QUESTION_BACKGROUND}
              width={1920}
              height={400}
              alt="Pytanie"
              className="w-full invisible"
              draggable={false}
            />

            <div
              ref={prizeRef}
              className="absolute top-[31%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-[9%] h-[15%] flex items-center justify-center"
            >
              <p
                style={{ ...COINY.style, fontSize: prizeFontSize }}
                className={`text-center text-shadow-bold ${
                  showWinScreen ? "text-green-400" : "text-white"
                }`}
              >
                {showWinScreen ? "WYGRANA" : currentPrize}
              </p>
            </div>

            <div
              ref={questionRef}
              className="absolute top-[55%] -translate-y-1/2 h-[40%] left-1/2 -translate-x-1/2 w-[76%] flex items-center justify-center"
            >
              <p
                style={{ ...INTER.style, fontSize: questionFontSize }}
                className="text-white text-center font-bold text-shadow-bold"
              >
                {displayQuestionText}
              </p>
            </div>
          </div>
        )}
        {/* Koła ratunkowe (graficzne) */}
        <div
          className={`flex justify-center gap-4 transition-all duration-500 ${
            !showGameContent ||
            showWinScreen ||
            isTransitioning ||
            isGameStartTransition ||
            isSessionClosedTransition
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          }`}
        >
          {/* 50:50 */}
          <Image
            src={
              lifelinesUsed.fiftyFifty
                ? IMAGES.LIFELINES_BACKGROUND.FIFTY_FIFTY.USED
                : IMAGES.LIFELINES_BACKGROUND.FIFTY_FIFTY.AVAILABLE
            }
            alt="Koło ratunkowe 50:50"
            width={512}
            height={512}
            draggable={false}
            className="w-[120px] h-auto select-none transition-opacity"
            priority
          />
          {/* Publiczność */}
          <Image
            src={
              lifelinesUsed.askAudience
                ? IMAGES.LIFELINES_BACKGROUND.VOTING.USED
                : IMAGES.LIFELINES_BACKGROUND.VOTING.AVAILABLE
            }
            alt="Koło ratunkowe - pytanie do publiczności"
            width={512}
            height={512}
            draggable={false}
            className="w-[120px] h-auto select-none transition-opacity"
            priority
          />
          {/* Telefon */}
          <Image
            src={
              lifelinesUsed.phoneAFriend
                ? IMAGES.LIFELINES_BACKGROUND.PHONE.USED
                : IMAGES.LIFELINES_BACKGROUND.PHONE.AVAILABLE
            }
            alt="Koło ratunkowe - telefon do przyjaciela"
            width={512}
            height={512}
            draggable={false}
            className="w-[120px] h-auto select-none transition-opacity"
            priority
          />
        </div>

        <div></div>

        {/* Odpowiedzi */}
        {currentQuestion && (
          <div
            className={`-space-y-8 relative transition-all duration-500 ${
              !showGameContent ||
              showWinScreen ||
              isTransitioning ||
              isGameStartTransition ||
              isSessionClosedTransition
                ? "opacity-0 pointer-events-none"
                : "opacity-100"
            }`}
          >
            {/* Rząd A i B */}
            <div
              className="relative transition-all duration-500 ease-in-out bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${getAnswerRowBackground(
                  getAnswerState("A"),
                  getAnswerState("B")
                )})`,
              }}
            >
              {/* Niewidoczny obrazek dla wymiarów */}
              <Image
                src={getAnswerRowBackground(
                  getAnswerState("A"),
                  getAnswerState("B")
                )}
                width={1920}
                height={150}
                alt="Odpowiedzi A i B"
                className="w-full invisible"
                draggable={false}
              />

              {/* Odpowiedź A */}
              {isAnswerVisible("A") && (
                <div
                  ref={answerARef}
                  className="absolute left-[14.5%] top-1/2 -translate-y-1/2 w-[29%] h-[50%] flex items-center"
                >
                  <p
                    style={{ ...INTER.style, fontSize: answerAFontSize }}
                    className="text-white font-bold px-4 text-shadow-bold flex justify-between items-center w-full"
                  >
                    <span className="font-extrabold">A:</span>
                    <span>{currentQuestion.answers.A}</span>
                    <span className="invisible">A:</span>
                  </p>
                </div>
              )}

              {/* Odpowiedź B */}
              {isAnswerVisible("B") && (
                <div
                  ref={answerBRef}
                  className="absolute right-[14.5%] top-1/2 -translate-y-1/2 w-[29%] h-[50%] flex items-center"
                >
                  <p
                    style={{ ...INTER.style, fontSize: answerBFontSize }}
                    className="text-white font-bold px-4 text-shadow-bold flex justify-between items-center w-full"
                  >
                    <span className="font-extrabold">B:</span>
                    <span>{currentQuestion.answers.B}</span>
                    <span className="invisible">B:</span>
                  </p>
                </div>
              )}
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-fit h-[55%]">
              <span
                style={{ ...COINY.style }}
                className="absolute left-1/2 top-[52%] -translate-y-1/2 -translate-x-1/2 text-white text-4xl text-shadow-bold"
              >
                {questionIndex + 1}
              </span>
              <Image
                src={IMAGES.QUESTION_INDEX_BACKGROUND}
                alt="Indeks pytania"
                width={256}
                height={256}
                className="h-full w-full"
              />
            </div>

            {/* Rząd C i D */}
            <div
              className="relative transition-all duration-500 ease-in-out bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${getAnswerRowBackground(
                  getAnswerState("C"),
                  getAnswerState("D")
                )})`,
              }}
            >
              {/* Niewidoczny obrazek dla wymiarów */}
              <Image
                src={getAnswerRowBackground(
                  getAnswerState("C"),
                  getAnswerState("D")
                )}
                width={1920}
                height={150}
                alt="Odpowiedzi C i D"
                className="w-full invisible"
                draggable={false}
              />

              {/* Odpowiedź C */}
              {isAnswerVisible("C") && (
                <div
                  ref={answerCRef}
                  className="absolute left-[14.5%] top-1/2 -translate-y-1/2 w-[29%] h-[50%] flex items-center"
                >
                  <p
                    style={{ ...INTER.style, fontSize: answerCFontSize }}
                    className="text-white font-bold px-4 text-shadow-bold flex justify-between items-center w-full"
                  >
                    <span className="font-extrabold">C:</span>
                    <span>{currentQuestion.answers.C}</span>
                    <span className="invisible">C:</span>
                  </p>
                </div>
              )}

              {/* Odpowiedź D */}
              {isAnswerVisible("D") && (
                <div
                  ref={answerDRef}
                  className="absolute right-[14.5%] top-1/2 -translate-y-1/2 w-[29%] h-[50%] flex items-center"
                >
                  <p
                    style={{ ...INTER.style, fontSize: answerDFontSize }}
                    className="text-white font-bold px-4 text-shadow-bold flex justify-between items-center w-full"
                  >
                    <span className="font-extrabold">D:</span>
                    <span>{currentQuestion.answers.D}</span>
                    <span className="invisible">D:</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stan głosowania publiczności */}
        {audienceVotingActive && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded">
              <h3 className="text-xl mb-4">
                🗳️ Trwa głosowanie publiczności...
              </h3>
              <div className="animate-pulse bg-blue-500 w-16 h-16 rounded-full mx-auto"></div>
            </div>
          </div>
        )}

        {/* Stan pauzy */}
        {gameStatus === "paused" && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="bg-white p-8 rounded text-center">
              <h2 className="text-2xl font-bold mb-4">Gra wstrzymana</h2>
              <p>Oczekiwanie na wznowienie...</p>
            </div>
          </div>
        )}

        {/* Preloadowanie wszystkich obrazków tła odpowiedzi */}
        <div className="hidden">
          <Image
            src={IMAGES.ANSWER_BACKGROUNDS.DEFAULT_DEFAULT}
            width={1920}
            height={150}
            alt="Preload"
            priority
          />
          <Image
            src={IMAGES.ANSWER_BACKGROUNDS.DEFAULT_SELECTED}
            width={1920}
            height={150}
            alt="Preload"
            priority
          />
          <Image
            src={IMAGES.ANSWER_BACKGROUNDS.DEFAULT_CORRECT}
            width={1920}
            height={150}
            alt="Preload"
            priority
          />
          <Image
            src={IMAGES.ANSWER_BACKGROUNDS.CORRECT_DEFAULT}
            width={1920}
            height={150}
            alt="Preload"
            priority
          />
          <Image
            src={IMAGES.ANSWER_BACKGROUNDS.CORRECT_SELECTED}
            width={1920}
            height={150}
            alt="Preload"
            priority
          />
          <Image
            src={IMAGES.ANSWER_BACKGROUNDS.SELECTED_DEFAULT}
            width={1920}
            height={150}
            alt="Preload"
            priority
          />
          <Image
            src={IMAGES.ANSWER_BACKGROUNDS.SELECTED_CORRECT}
            width={1920}
            height={150}
            alt="Preload"
            priority
          />
        </div>
      </div>

      {/* EKRAN PRZEJŚCIOWY - NAKŁADKA */}
      {showTransitionScreen && (
        <div className="fixed inset-0 z-[9999] transition-screen-overlay backdrop-blur-2xl bg-black/20">
          {/* Logo animowane - przechodzi z pozycji górnej na środek i pulsuje */}
          <div className="min-h-screen flex items-center justify-center">
            <div className="transition-screen-logo">
              <Image
                src={IMAGES.LOGO}
                alt="Logo Milionerzy"
                width={600}
                height={300}
                className="drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* EKRAN PRZEJŚCIOWY - PRZEJŚCIE Z WYGRANEJ DO OCZEKIWANIA */}
      {isBackToWaitingTransition && showWinScreen && (
        <div className="fixed inset-0 z-[9999] transition-screen-overlay backdrop-blur-2xl bg-black/20">
          <div className="min-h-screen flex items-center justify-center">
            <div className="transition-screen-logo">
              <Image
                src={IMAGES.LOGO}
                alt="Logo Milionerzy"
                width={600}
                height={300}
                className="drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* EKRAN PRZEJŚCIOWY - ZAMKNIĘCIE SESJI PRZEZ ADMINA */}
      {isSessionClosedTransition && !showWinScreen && (
        <div className="fixed inset-0 z-[9999] transition-screen-overlay backdrop-blur-2xl bg-black/20">
          <div className="min-h-screen flex items-center justify-center">
            <div className="transition-screen-logo">
              <Image
                src={IMAGES.LOGO}
                alt="Logo Milionerzy"
                width={600}
                height={300}
                className="drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* EKRAN PRZEJŚCIOWY - START GRY */}
      {isGameStartTransition && (
        <div className="fixed inset-0 z-[9999] transition-screen-overlay backdrop-blur-2xl bg-black/20">
          <div className="min-h-screen flex items-center justify-center">
            <div className="transition-screen-logo">
              <Image
                src={IMAGES.LOGO}
                alt="Logo Milionerzy"
                width={600}
                height={300}
                className="drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
