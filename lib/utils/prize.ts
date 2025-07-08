import { GAME_CONSTANTS } from "@/lib/constants/game";

/**
 * Zwraca nagrodę za aktualne pytanie na podstawie indeksu
 */
export function getCurrentPrize(questionIndex: number): string {
  return (
    GAME_CONSTANTS.PRIZE_AMOUNTS[
      Math.min(questionIndex, GAME_CONSTANTS.PRIZE_AMOUNTS.length - 1)
    ] || "0 zł"
  );
}

/**
 * Zwraca nagrodę, którą gracz wygrywa na podstawie odpowiedzianych pytań
 */
export function getWinningPrize(questionIndex: number): string {
  // Gracz wygrywa nagrodę za ostatnie poprawnie odpowiedziane pytanie
  // Jeśli currentQuestionIndex = 0, gracz jeszcze nie odpowiedział na żadne pytanie
  // Jeśli currentQuestionIndex = 1, gracz odpowiedział poprawnie na pytanie 1, więc wygrywa prizes[0] = 500 zł
  // Jeśli currentQuestionIndex = 5, gracz odpowiedział poprawnie na pytania 1-5, więc wygrywa prizes[4] = 10 000 zł

  if (questionIndex === 0) {
    return "0 zł"; // Gracz jeszcze nie odpowiedział na żadne pytanie
  }

  const winningIndex = questionIndex - 1;
  return GAME_CONSTANTS.PRIZE_AMOUNTS[winningIndex] || "0 zł";
}
