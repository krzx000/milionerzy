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
    audienceVotingActive, // Czy trwa głosowanie publiczności

    // Animacje
    showQuestionAnimation, // Czy pokazać animację pytania
    showAnswerAnimation, // Czy pokazać animację odpowiedzi

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
    maxFontSize: 300,
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

  // ============== EFEKTY I LOGIKA ==============

  // Inicjalizacja połączenia
  React.useEffect(() => {
    const initializeConnection = async () => {
      console.log("🎮 Player: Rozpoczynanie inicjalizacji połączenia...");
      try {
        const pingResult = await PlayerAPI.ping();
        console.log("🎮 Player: Odpowiedź ping:", pingResult);

        if (pingResult.success) {
          setConnectionStatus(PLAYER_CONSTANTS.CONNECTION_STATES.CONNECTED);
          console.log("🎮 Player: Połączenie ustanowione");
        } else {
          console.error(
            "🎮 Player: Ping zakończony niepowodzeniem:",
            pingResult.error
          );
          setConnectionStatus(PLAYER_CONSTANTS.CONNECTION_STATES.ERROR);
        }
      } catch (error) {
        console.error(
          "🎮 Player: Błąd inicjalizacji połączenia gracza:",
          error
        );
        setConnectionStatus(PLAYER_CONSTANTS.CONNECTION_STATES.ERROR);
      } finally {
        setIsInitialized(true);
        console.log("🎮 Player: Inicjalizacja zakończona");
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

  // Dźwięk startowy przy nowym pytaniu
  React.useEffect(() => {
    if (currentQuestion && showQuestionAnimation && questionIndex >= 0) {
      console.log("🎵 Nowe pytanie - odtwarzanie dźwięku startowego");
      playStartSound(questionIndex + 1);
    }
  }, [currentQuestion, showQuestionAnimation, questionIndex, playStartSound]);

  // Dźwięk wyboru odpowiedzi
  React.useEffect(() => {
    if (selectedAnswer && !isAnswerRevealed) {
      console.log("🎵 Wybrano odpowiedź - odtwarzanie dźwięku");
      playAnswerSound();
    }
  }, [selectedAnswer, isAnswerRevealed, playAnswerSound]);

  // Dźwięki wyników
  React.useEffect(() => {
    if (isAnswerRevealed && selectedAnswer && correctAnswer) {
      const isCorrect = selectedAnswer === correctAnswer;
      console.log("🎵 Ujawniono odpowiedź - odtwarzanie dźwięków");

      playLightsDown();

      setTimeout(() => {
        if (isCorrect) {
          console.log("🎵 Poprawna odpowiedź - dźwięk wygranej");
          playWinSound();
        } else {
          console.log("🎵 Niepoprawna odpowiedź - dźwięk przegranej");
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
      console.log("🎵 Gra zakończona/oczekująca - zatrzymywanie dźwięków");
      stopAll();
    }
  }, [gameStatus, stopAll]);

  // Zarządzanie wynikami koła ratunkowego 50:50
  React.useEffect(() => {
    if (currentQuestion && lifelinesUsed.fiftyFifty) {
      // Symuluj ukrycie dwóch niepoprawnych odpowiedzi
      const allAnswers: AnswerKey[] = ["A", "B", "C", "D"];
      const correctKey = correctAnswer as AnswerKey;
      const availableIncorrect = allAnswers.filter((key) => key !== correctKey);

      // Wybierz jedną niepoprawną odpowiedź do pokazania (losowo)
      const randomIncorrect =
        availableIncorrect[
          Math.floor(Math.random() * availableIncorrect.length)
        ];
      setLifelineResult([correctKey, randomIncorrect]);
    } else {
      setLifelineResult(["A", "B", "C", "D"]);
    }
  }, [
    currentQuestion,
    lifelinesUsed.fiftyFifty,
    correctAnswer,
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
    // Potem sprawdzamy czy jest wybrana (ale nie ujawniona)
    if (selectedAnswer === key && !isAnswerRevealed) return "selected";
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

  // Jeśli gra nie została jeszcze rozpoczęta
  if (gameStatus === "waiting" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <h1>Milionerzy</h1>
        <p>Oczekiwanie na rozpoczęcie gry...</p>
        <p>
          Status: {getConnectionStatusText(connectionStatus)}{" "}
          {getConnectionStatusEmoji(connectionStatus)}
        </p>
      </div>
    );
  }

  // Jeśli gra się zakończyła
  if (gameStatus === "ended") {
    return <></>;
  }

  // ============== GŁÓWNY WIDOK GRY - TUTAJ ZBUDUJ SWÓJ INTERFEJS ==============
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${IMAGES.BACKGROUND})` }}
    >
      {/* TUTAJ MOŻESZ ZBUDOWAĆ SWÓJ WŁASNY INTERFEJS */}

      {/* Przykładowa podstawowa struktura - możesz całkowicie ją zastąpić */}
      <div className="">
        {/* Górna sekcja - nagroda i koła ratunkowe */}
        <div className="flex justify-between items-center mb-8">
          {/* Koła ratunkowe */}
          <div className="flex gap-4">
            <div
              className={`p-2 rounded ${
                lifelinesUsed.fiftyFifty ? "bg-red-500" : "bg-green-500"
              } text-white`}
            >
              50:50 {lifelinesUsed.fiftyFifty ? "✗" : "✓"}
            </div>
            <div
              className={`p-2 rounded ${
                lifelinesUsed.askAudience ? "bg-red-500" : "bg-green-500"
              } text-white`}
            >
              Publiczność {lifelinesUsed.askAudience ? "✗" : "✓"}
            </div>
            <div
              className={`p-2 rounded ${
                lifelinesUsed.phoneAFriend ? "bg-red-500" : "bg-green-500"
              } text-white`}
            >
              Telefon {lifelinesUsed.phoneAFriend ? "✗" : "✓"}
            </div>
          </div>
        </div>

        {/* Pytanie */}
        {currentQuestion && (
          <div
            className="relative transition-all duration-500 ease-in-out bg-cover bg-center bg-no-repeat"
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
                className="text-white text-center text-shadow-bold"
              >
                {currentPrize}
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
                {currentQuestion.content}
              </p>
            </div>
          </div>
        )}

        {/* Odpowiedzi */}
        {currentQuestion && (
          <div className="space-y-4">
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

        {/* Informacje pomocnicze do developmentu */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-gray-100 rounded">
            <details>
              <summary className="cursor-pointer font-bold">Debug Info</summary>
              <pre className="text-xs mt-2 whitespace-pre-wrap">
                {JSON.stringify(
                  {
                    gameStatus,
                    questionIndex,
                    selectedAnswer,
                    correctAnswer,
                    isAnswerRevealed,
                    answerLocked,
                    timeRemaining,
                    isConnected,
                    connectionStatus,
                    lifelinesUsed,
                    audienceVotingActive,
                    showQuestionAnimation,
                    showAnswerAnimation,
                  },
                  null,
                  2
                )}
              </pre>
            </details>
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
    </div>
  );
}
