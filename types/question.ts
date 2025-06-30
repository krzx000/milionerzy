export type AnswerOption = "A" | "B" | "C" | "D";

export type Question = {
  id: string; // UUID lub inny unikalny identyfikator
  content: string; // Treść pytania
  answers: Record<AnswerOption, string>; // Odpowiedzi A, B, C, D
  correctAnswer: AnswerOption; // Poprawna odpowiedź
  reward: number; // Kwota za to pytanie
  isGuaranteed?: boolean; // Czy to pytanie gwarantowane (opcjonalne)
  level: number; // Numer rundy (1–12)
};
