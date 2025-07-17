"use client";

import * as React from "react";
import { motion } from "framer-motion";
import useFitText from "use-fit-text";
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
  IMAGES,
  getAnswerBackground,
  //   mapLifelineToUI,
  type AnswerKey,
  type LifelineType,
} from "@/lib/utils/game-assets";
import type { ConnectionState } from "@/lib/constants/player";
import "./player.css";
import Image from "next/image";

export default function PlayerViewPage() {
  // ============== DOSTĘPNE STATE'Y I ZMIENNE ==============

  // Hook ze stanem gry
  const {
    // Stan gry
    session, // Aktualna sesja gry
    currentQuestion, // Aktualne pytanie
    questionIndex, // Indeks pytania (0-based)
    // totalQuestions, // Łączna liczba pytań
    currentPrize, // Aktualna nagroda
    gameStatus, // Status gry: "waiting" | "active" | "paused" | "ended"

    // Stan odpowiedzi
    selectedAnswer, // Wybrana odpowiedź (A/B/C/D)
    correctAnswer, // Poprawna odpowiedź (A/B/C/D)
    isAnswerRevealed, // Czy odpowiedź została ujawniona
    answerLocked, // Czy odpowiedź została zatwierdzona
    // showFinalAnswer, // Czy pokazać finalne podsumowanie odpowiedzi

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
    // showAnswerAnimation, // Czy pokazać animację odpowiedzi

    // Historia
    answerHistory, // Historia wszystkich odpowiedzi

    // Funkcje pomocnicze
    isConnected, // Czy połączony z SSE
    // formatTime, // Funkcja do formatowania czasu
    // isAnswerHidden, // Funkcja sprawdzająca czy odpowiedź jest ukryta (50:50)
    // getAnswerClass, // Funkcja zwracająca klasę CSS dla odpowiedzi
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

  // Stan lokalny dla połączenia
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [connectionStatus, setConnectionStatus] =
    React.useState<ConnectionState>(
      PLAYER_CONSTANTS.CONNECTION_STATES.CONNECTING
    );

  // Stan lokalny dla efektów wizualnych (możesz rozszerzyć)
  const [particles, setParticles] = React.useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const [celebrationBursts, setCelebrationBursts] = React.useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const [questionTransition, setQuestionTransition] = React.useState(false);

  // Hooks do automatycznego skalowania fontów
  const { fontSize: questionFontSize, ref: questionFontRef } = useFitText({
    maxFontSize: 300,
    minFontSize: 34,
  });

  const { fontSize: answerAFontSize, ref: answerAFontRef } = useFitText({
    maxFontSize: 300,
    minFontSize: 16,
  });

  const { fontSize: answerBFontSize, ref: answerBFontRef } = useFitText({
    maxFontSize: 300,
    minFontSize: 16,
  });

  const { fontSize: answerCFontSize, ref: answerCFontRef } = useFitText({
    maxFontSize: 300,
    minFontSize: 16,
  });

  const { fontSize: answerDFontSize, ref: answerDFontRef } = useFitText({
    maxFontSize: 300,
    minFontSize: 16,
  });

  const { fontSize: prizeFontSize, ref: prizeFontRef } = useFitText({
    maxFontSize: 250,
    minFontSize: 20,
  });

  // Funkcja pomocnicza do wyboru odpowiedniego ref i fontSize dla odpowiedzi
  const getAnswerFontProps = (key: AnswerKey) => {
    switch (key) {
      case "A":
        return { ref: answerAFontRef, fontSize: answerAFontSize };
      case "B":
        return { ref: answerBFontRef, fontSize: answerBFontSize };
      case "C":
        return { ref: answerCFontRef, fontSize: answerCFontSize };
      case "D":
        return { ref: answerDFontRef, fontSize: answerDFontSize };
      default:
        return { ref: answerAFontRef, fontSize: answerAFontSize };
    }
  };

  // Stan dla aktywnego koła ratunkowego (animacja)
  const [activeLifeline, setActiveLifeline] =
    React.useState<LifelineType | null>(null);

  // Stan dla wyników koła ratunkowego (które odpowiedzi pokazać po 50:50)
  const [lifelineResult, setLifelineResult] = React.useState<AnswerKey[]>([
    "A",
    "B",
    "C",
    "D",
  ]);

  // ============== FUNKCJE POMOCNICZE ==============

  // Funkcja do tworzenia efektów cząsteczkowych
  const createParticles = React.useCallback((count: number = 20) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 20,
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.find((np) => np.id === p.id))
      );
    }, 4000);
  }, []);

  // Funkcja do tworzenia efektów wybuchowych
  const createCelebrationBursts = React.useCallback((count: number = 5) => {
    const newBursts = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }));

    setCelebrationBursts((prev) => [...prev, ...newBursts]);

    setTimeout(() => {
      setCelebrationBursts((prev) =>
        prev.filter((b) => !newBursts.find((nb) => nb.id === b.id))
      );
    }, 1000);
  }, []);

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

  // Efekt przejścia pytania
  React.useEffect(() => {
    if (showQuestionAnimation) {
      setQuestionTransition(true);
      const timer = setTimeout(() => setQuestionTransition(false), 800);
      return () => clearTimeout(timer);
    }
  }, [showQuestionAnimation]);

  // Efekt cząsteczkowy dla poprawnej odpowiedzi
  React.useEffect(() => {
    if (isAnswerRevealed && selectedAnswer === correctAnswer) {
      createParticles(40);
      createCelebrationBursts(8);

      setTimeout(() => createParticles(25), 500);
      setTimeout(() => createParticles(15), 1000);
    }
  }, [
    isAnswerRevealed,
    selectedAnswer,
    correctAnswer,
    createParticles,
    createCelebrationBursts,
  ]);

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

  // ============== RENDER - TUTAJ MOŻESZ DODAĆ SWÓJ WYGLĄD ==============

  // Jeśli nie jest jeszcze zainicjalizowane
  if (!isInitialized) {
    return (
      <div className="loading">
        <p>Łączenie z grą...</p>
      </div>
    );
  }

  // Jeśli wystąpił błąd połączenia
  if (connectionStatus === PLAYER_CONSTANTS.CONNECTION_STATES.ERROR) {
    return (
      <div className="error">
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
      <div className="waiting">
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
    return (
      <div className="game-ended">
        <h1>Koniec gry!</h1>
        <h2>{finalResult === "win" ? "Wygrana!" : "Przegrana"}</h2>
        <p>Wygrane: {winnings}</p>

        {/* Historia odpowiedzi */}
        {answerHistory.length > 0 && (
          <div>
            <h3>Historia odpowiedzi:</h3>
            {answerHistory.map((answer, index) => (
              <div
                key={index}
                className={answer.isCorrect ? "correct" : "incorrect"}
              >
                Pytanie {answer.questionIndex + 1}: {answer.selectedAnswer}
                (poprawna: {answer.correctAnswer})
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Główny widok gry
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Górna sekcja z nagrodą i kołami ratunkowymi */}
      <div className="mt-16 flex justify-between">
        {/* Aktualna nagroda */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="image-styling relative w-80"
            style={{ backgroundImage: `url(${IMAGES.PRIZE_BACKGROUND})` }}
          >
            <div
              ref={prizeFontRef}
              style={{ fontSize: prizeFontSize }}
              className="absolute left-[35%] top-1/2 -translate-y-1/2 w-[53%] h-[90%] text-center font-bold text-white flex items-center justify-center"
            >
              {currentPrize}
            </div>
            <Image
              width={2000}
              height={2000}
              src={IMAGES.PRIZE_BACKGROUND}
              className="invisible"
              alt="Prize"
            />
          </div>
        </motion.div>

        {/* Koła ratunkowe */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex gap-4">
            {/* 50:50 */}
            <div className="relative">
              <Image
                width={2000}
                height={2000}
                src={IMAGES.CROSS_MARK || "/assets/images/cross-mark.png"}
                className={`absolute w-3/4 transition-opacity duration-200 ${
                  lifelinesUsed.fiftyFifty ? "opacity-100" : "opacity-0"
                }`}
                alt="Użyte 50:50"
              />
              <Image
                width={2000}
                height={2000}
                src={IMAGES.HINTS.F_F}
                className="w-3/4"
                alt="50:50"
              />
            </div>

            {/* Publiczność */}
            <div className="relative">
              <Image
                width={2000}
                height={2000}
                src={IMAGES.CROSS_MARK || "/assets/images/cross-mark.png"}
                className={`absolute w-3/4 transition-opacity duration-200 ${
                  lifelinesUsed.askAudience ? "opacity-100" : "opacity-0"
                }`}
                alt="Użyte głosowanie"
              />
              <Image
                width={2000}
                height={2000}
                src={IMAGES.HINTS.VOTING}
                className="w-3/4"
                alt="Publiczność"
              />
            </div>

            {/* Telefon */}
            <div className="relative">
              <Image
                width={2000}
                height={2000}
                src={IMAGES.CROSS_MARK || "/assets/images/cross-mark.png"}
                className={`absolute w-3/4 transition-opacity duration-200 ${
                  lifelinesUsed.phoneAFriend ? "opacity-100" : "opacity-0"
                }`}
                alt="Użyty telefon"
              />
              <Image
                width={2000}
                height={2000}
                src={IMAGES.HINTS.PHONE}
                className="w-3/4"
                alt="Telefon"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Dolna sekcja z pytaniem i odpowiedziami */}
      <div className="absolute bottom-16 flex flex-col gap-16 w-full">
        {/* Pytanie */}
        {currentQuestion && (
          <motion.div
            key={currentQuestion.content}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="image-styling relative w-full"
              style={{ backgroundImage: `url(${IMAGES.QUESTION_BACKGROUND})` }}
            >
              <div
                ref={questionFontRef}
                style={{ fontSize: questionFontSize }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[90%] text-center font-bold text-white flex justify-center items-center"
              >
                {currentQuestion.content}
              </div>
              <Image
                width={2000}
                height={2000}
                src={IMAGES.QUESTION_BACKGROUND}
                className="invisible w-full"
                alt="Question Background"
              />
            </div>
          </motion.div>
        )}

        {/* Odpowiedzi */}
        {currentQuestion && (
          <div className="flex flex-col gap-4 relative">
            {/* Animacja aktywnego koła ratunkowego */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-28">
              {activeLifeline && (
                <Image
                  width={2000}
                  height={2000}
                  src={IMAGES.HINTS[activeLifeline]}
                  alt=""
                  id="HINTANIMATION"
                />
              )}
            </div>

            {/* Grupa A i B */}
            <div className="flex">
              {(["A", "B"] as AnswerKey[]).map((key) => (
                <motion.div
                  className="flex-1"
                  key={`${key}-${questionIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    delay: 0.5 * (key === "A" ? 1 : 2),
                  }}
                >
                  <div
                    className={`image-styling relative ${
                      lifelineResult.includes(key) ? key : "opacity-0"
                    }`}
                    style={{
                      backgroundImage: `url(${getAnswerBackground(
                        key,
                        selectedAnswer === key
                          ? "selected"
                          : isAnswerRevealed && correctAnswer === key
                          ? "correct"
                          : "normal"
                      )})`,
                    }}
                  >
                    <div
                      ref={getAnswerFontProps(key).ref}
                      style={{ fontSize: getAnswerFontProps(key).fontSize }}
                      className={`absolute ${
                        key === "A" ? "left-[35%]" : "left-[20%]"
                      } top-1/2 -translate-y-1/2 w-[57.5%] font-bold flex justify-start items-center text-white h-[90%]`}
                    >
                      {currentQuestion.answers[key]}
                    </div>
                    <Image
                      width={2000}
                      height={2000}
                      src={getAnswerBackground(
                        key,
                        selectedAnswer === key
                          ? "selected"
                          : isAnswerRevealed && correctAnswer === key
                          ? "correct"
                          : "normal"
                      )}
                      className="invisible w-full"
                      alt={` Answer Background ${key}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Grupa C i D */}
            <div className="flex">
              {(["C", "D"] as AnswerKey[]).map((key) => (
                <motion.div
                  className="flex-1"
                  key={`${key}-${questionIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    delay: 0.5 * (key === "C" ? 3 : 4),
                  }}
                >
                  <div
                    className={`image-styling relative ${
                      lifelineResult.includes(key) ? key : "opacity-0"
                    }`}
                    style={{
                      backgroundImage: `url(${getAnswerBackground(
                        key,
                        selectedAnswer === key
                          ? "selected"
                          : isAnswerRevealed && correctAnswer === key
                          ? "correct"
                          : "normal"
                      )})`,
                    }}
                  >
                    <div
                      ref={getAnswerFontProps(key).ref}
                      style={{ fontSize: getAnswerFontProps(key).fontSize }}
                      className={`absolute ${
                        key === "C" ? "left-[35%]" : "left-[20%]"
                      } top-1/2 -translate-y-1/2 w-[57.5%] font-bold h-[90%] flex justify-start items-center text-white`}
                    >
                      {currentQuestion.answers[key]}
                    </div>
                    <Image
                      width={2000}
                      height={2000}
                      src={getAnswerBackground(
                        key,
                        selectedAnswer === key
                          ? "selected"
                          : isAnswerRevealed && correctAnswer === key
                          ? "correct"
                          : "normal"
                      )}
                      className="invisible w-full"
                      alt={`Answer Background ${key}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stan głosowania publiczności */}
      {audienceVotingActive && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-blue-900 p-8 rounded-lg text-center"
          >
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">
              🗳️ Trwa głosowanie publiczności...
            </h3>
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-yellow-400 rounded-full mx-auto"></div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Stan pauzy */}
      {gameStatus === "paused" && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-gray-900 p-8 rounded-lg text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Gra wstrzymana
            </h2>
            <p className="text-xl text-gray-300">
              Oczekiwanie na wznowienie...
            </p>
          </motion.div>
        </div>
      )}

      {/* Efekty wizualne */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{ left: `${particle.x}px`, top: `${particle.y}px` }}
        />
      ))}

      {celebrationBursts.map((burst) => (
        <div
          key={burst.id}
          className="celebration-burst"
          style={{ left: `${burst.x}px`, top: `${burst.y}px` }}
        />
      ))}

      {/* Debug info (development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 p-4 rounded text-white text-sm max-w-xs">
          <details>
            <summary className="cursor-pointer">Debug Info</summary>
            <pre className="text-xs mt-2">
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
                },
                null,
                2
              )}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
