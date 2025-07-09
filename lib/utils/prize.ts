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
 * Zwraca nagrodę, którą gracz wygrywa po zakończeniu gry
 */
export function getWinningPrize(
  questionIndex: number,
  totalQuestions: number
): string {
  // Sprawdź czy gracz wygrał całą grę
  if (questionIndex >= totalQuestions) {
    return "1 000 000 zł";
  }

  // Jeśli przegrał, gracz wygrywa kwotę za poprzednie pytanie (gwarantowaną)
  if (questionIndex > 0) {
    return getCurrentPrize(questionIndex - 1);
  }

  // Jeśli przegrał na pierwszym pytaniu, wygrywa 0 zł
  return "0 zł";
}
