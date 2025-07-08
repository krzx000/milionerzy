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
 * Zwraca nagrodę, którą gracz wygrywa po zatrzymaniu gry
 */
export function getWinningPrize(questionIndex: number): string {
  // Po zatrzymaniu gry, gracz wygrywa kwotę za aktualne pytanie (na którym się zatrzymał)
  // nie za ostatnie poprawnie odpowiedziane pytanie
  return getCurrentPrize(questionIndex);
}
