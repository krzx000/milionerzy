"use client";

import * as React from "react";
import { usePlayerState } from "@/hooks/use-player-state";
import { PlayerAPI } from "@/lib/api/player";
import { PLAYER_CONSTANTS } from "@/lib/constants/player";
import {
  getConnectionStatusText,
  getConnectionStatusEmoji,
  getTimerClass,
  getProgressColor,
  calculateGameProgress,
  getTimerBarWidth,
  formatLogData,
} from "@/lib/utils/player";
import type { ConnectionState } from "@/lib/constants/player";

export default function PlayerViewPage() {
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
    audienceVotingActive,

    // Animacje
    showQuestionAnimation,
    showAnswerAnimation,

    // Historia
    answerHistory,

    // Funkcje pomocnicze
    isConnected,
    formatTime,
    isAnswerHidden,
    getAnswerClass,
  } = usePlayerState();

  // Stan lokalny dla player view
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [connectionStatus, setConnectionStatus] =
    React.useState<ConnectionState>(
      PLAYER_CONSTANTS.CONNECTION_STATES.CONNECTING
    );

  // Inicjalizacja połączenia
  React.useEffect(() => {
    const initializeConnection = async () => {
      console.log("🎮 Player: Rozpoczynanie inicjalizacji połączenia...");
      try {
        // Ping serwera
        console.log("🎮 Player: Wysyłanie ping do serwera...");
        const pingResult = await PlayerAPI.ping();
        console.log("🎮 Player: Odpowiedź ping:", pingResult);

        if (pingResult.success) {
          // Żądaj aktualnego stanu gry
          console.log("🎮 Player: Żądanie aktualnego stanu gry...");
          await PlayerAPI.requestCurrentState();
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
    console.log(
      "🎮 Player: Status SSE zmienił się - isConnected:",
      isConnected,
      "isInitialized:",
      isInitialized
    );
    if (isConnected) {
      setConnectionStatus(PLAYER_CONSTANTS.CONNECTION_STATES.CONNECTED);
      console.log("🎮 Player: SSE połączone");
    } else if (isInitialized) {
      setConnectionStatus(PLAYER_CONSTANTS.CONNECTION_STATES.DISCONNECTED);
      console.log("🎮 Player: SSE rozłączone");
    }
  }, [isConnected, isInitialized]);

  // Logowanie ważnych wydarzeń po stronie gracza
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

  // Jeśli nie jest jeszcze zainicjalizowane
  if (!isInitialized) {
    return (
      <div className="player-view-container loading">
        <div className="connection-status">
          <div className="spinner"></div>
          <p>Łączenie z grą...</p>
        </div>
      </div>
    );
  }

  // Jeśli wystąpił błąd połączenia
  if (connectionStatus === PLAYER_CONSTANTS.CONNECTION_STATES.ERROR) {
    return (
      <div className="player-view-container error">
        <div className="connection-status">
          <h2>Błąd połączenia</h2>
          <p>Nie udało się połączyć z serwerem gry.</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  // Jeśli gra nie została jeszcze rozpoczęta
  if (gameStatus === "waiting" || !session) {
    return (
      <div className="player-view-container waiting">
        <div className="game-status">
          <h1>Milionerzy</h1>
          <p>Oczekiwanie na rozpoczęcie gry...</p>
          <div className="connection-indicator">
            Status: {getConnectionStatusText(connectionStatus)}
          </div>
        </div>
      </div>
    );
  }

  // Jeśli gra się zakończyła
  if (gameStatus === "ended") {
    return (
      <div className="player-view-container game-ended">
        <div className="final-results">
          <h1>Koniec gry!</h1>
          <div className="final-score">
            <h2>Wynik: {finalResult === "win" ? "Wygrana!" : "Przegrana"}</h2>
            <p className="winnings">Wygrane: {winnings}</p>
          </div>

          {answerHistory.length > 0 && (
            <div className="answer-history">
              <h3>Historia odpowiedzi:</h3>
              <div className="history-list">
                {answerHistory.map((answer, index) => (
                  <div
                    key={index}
                    className={`history-item ${
                      answer.isCorrect ? "correct" : "incorrect"
                    }`}
                  >
                    <span className="question-number">
                      Pytanie {answer.questionIndex + 1}
                    </span>
                    <span className="selected-answer">
                      Wybrano: {answer.selectedAnswer}
                    </span>
                    <span className="correct-answer">
                      Poprawna: {answer.correctAnswer}
                    </span>
                    <span className="time-used">Czas: {answer.timeUsed}s</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Główny widok gry
  return (
    <div className="player-view-container active">
      {/* Header z informacjami o grze */}
      <header className="game-header">
        <div className="game-info">
          <div className="question-progress">
            Pytanie {questionIndex + 1} z {totalQuestions}
          </div>
          <div className="current-prize">Aktualna nagroda: {currentPrize}</div>
          <div className="connection-status">
            {getConnectionStatusEmoji(connectionStatus)}
            {getConnectionStatusText(connectionStatus)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${calculateGameProgress(questionIndex, totalQuestions)}%`,
              backgroundColor: getProgressColor(
                calculateGameProgress(questionIndex, totalQuestions)
              ),
            }}
          />
        </div>
      </header>

      {/* Timer */}
      {gameStatus === "active" && timeRemaining > 0 && (
        <div className={getTimerClass(timeRemaining)}>
          <div className="timer-text">
            Pozostały czas: {formatTime(timeRemaining)}
          </div>
          <div className="timer-bar">
            <div
              className="timer-fill"
              style={{
                width: `${getTimerBarWidth(timeRemaining)}%`,
                backgroundColor: timeRemaining <= 10 ? "#ff4444" : "#4caf50",
              }}
            />
          </div>
        </div>
      )}

      {/* Koła ratunkowe */}
      <div className="lifelines">
        <div className="lifelines-header">Koła ratunkowe:</div>
        <div className="lifelines-list">
          <div
            className={`lifeline ${
              lifelinesUsed.fiftyFifty ? "used" : "available"
            }`}
          >
            50:50 {lifelinesUsed.fiftyFifty ? "✓" : "○"}
          </div>
          <div
            className={`lifeline ${
              lifelinesUsed.phoneAFriend ? "used" : "available"
            }`}
          >
            Telefon {lifelinesUsed.phoneAFriend ? "✓" : "○"}
          </div>
          <div
            className={`lifeline ${
              lifelinesUsed.askAudience ? "used" : "available"
            }`}
          >
            Publiczność {lifelinesUsed.askAudience ? "✓" : "○"}
          </div>
        </div>
      </div>

      {/* Stan głosowania publiczności */}
      {audienceVotingActive && (
        <div className="audience-voting">
          <h3>🗳️ Trwa głosowanie publiczności...</h3>
        </div>
      )}

      {/* Główne pytanie */}
      {currentQuestion && (
        <main className="question-section">
          <div className={`question ${showQuestionAnimation ? "animate" : ""}`}>
            <h2 className="question-text">{currentQuestion.content}</h2>
          </div>

          {/* Odpowiedzi */}
          <div className="answers-grid">
            {Object.entries(currentQuestion.answers).map(
              ([answerLetter, answerText]) => {
                const isHidden = isAnswerHidden(answerLetter);
                const answerClass = getAnswerClass(answerLetter);

                return (
                  <div
                    key={answerLetter}
                    className={`answer-option ${answerClass} ${
                      isHidden ? "hidden" : ""
                    } ${
                      showAnswerAnimation && selectedAnswer === answerLetter
                        ? "animate"
                        : ""
                    }`}
                  >
                    <span className="answer-letter">{answerLetter}</span>
                    <span className="answer-text">
                      {isHidden ? "UKRYTE" : answerText}
                    </span>

                    {/* Wskaźniki stanu */}
                    {selectedAnswer === answerLetter && !isAnswerRevealed && (
                      <span className="selection-indicator">WYBRANE</span>
                    )}
                    {answerLocked && selectedAnswer === answerLetter && (
                      <span className="locked-indicator">ZATWIERDZONE</span>
                    )}
                    {isAnswerRevealed && correctAnswer === answerLetter && (
                      <span className="correct-indicator">POPRAWNA</span>
                    )}
                    {isAnswerRevealed &&
                      selectedAnswer === answerLetter &&
                      correctAnswer !== answerLetter && (
                        <span className="incorrect-indicator">NIEPOPRAWNA</span>
                      )}
                  </div>
                );
              }
            )}
          </div>

          {/* Informacje o stanie odpowiedzi */}
          {gameStatus === "active" && (
            <div className="answer-status">
              {!selectedAnswer && (
                <p className="status-text">
                  Oczekiwanie na wybór odpowiedzi...
                </p>
              )}
              {selectedAnswer && !answerLocked && (
                <p className="status-text">Wybrano: {selectedAnswer}</p>
              )}
              {answerLocked && !isAnswerRevealed && (
                <p className="status-text">
                  Odpowiedź zatwierdzona. Oczekiwanie na rezultat...
                </p>
              )}
              {showFinalAnswer && isAnswerRevealed && (
                <div className="final-answer-status">
                  <p
                    className={`result-text ${
                      selectedAnswer === correctAnswer ? "correct" : "incorrect"
                    }`}
                  >
                    {selectedAnswer === correctAnswer
                      ? "POPRAWNA ODPOWIEDŹ!"
                      : "NIEPOPRAWNA ODPOWIEDŹ!"}
                  </p>
                  <p className="correct-answer-text">
                    Poprawna odpowiedź: {correctAnswer}
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* Stan pauzy */}
      {gameStatus === "paused" && (
        <div className="game-paused">
          <h2>Gra wstrzymana</h2>
          <p>Oczekiwanie na wznowienie...</p>
        </div>
      )}

      {/* Debug info (tylko w development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="debug-info">
          <details>
            <summary>Debug Info</summary>
            <pre>
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
