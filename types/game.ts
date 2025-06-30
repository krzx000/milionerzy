import { AnswerOption, Question } from "./question";
import { LifelinesState, LifelineType } from "./lifeline";

export type GamePhase =
  | "waitingToStart" // Gra skonfigurowana, czeka na uruchomienie przez admina
  | "waitingForPlayer" // Czeka na odpowiedź gracza
  | "waitingForConfirmation" // Czeka na potwierdzenie odpowiedzi przez admina
  | "transitionToNext" // Czeka na przejście do kolejnego pytania
  | "ended"; // Gra zakończona, wyświetlenie wyników

export interface GameConfig {
  totalRounds: number; // ile rund w grze (max 12)
  guaranteedLevels: number[]; // np. [5, 10]
  lifelinesEnabled: LifelineType[]; // które koła są dostępne
}

export interface GameState {
  phase: GamePhase;
  currentLevel: number; // 1–12
  selectedAnswer?: AnswerOption; // odpowiedź wybrana przez gracza
  confirmedAnswer?: AnswerOption; // zatwierdzona przez admina
  questions: Question[]; // pytania na całą grę
  config: GameConfig; // konfiguracja gry
  lifelines: LifelinesState; // stan użycia kół
  safeReward: number; // aktualna kwota gwarantowana
  currentReward: number; // nagroda za aktualne pytanie
  lastCorrectLevel: number; // ostatni poprawnie ukończony poziom
}
