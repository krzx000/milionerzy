import * as React from "react";
import { SoundAPI } from "@/lib/sound/api";
import { DURATION } from "@/hooks/use-sound";

export function useSounds() {
  /**
   * Odtwórz dźwięk wygranej z fade
   */
  const playWinSound = React.useCallback((questionLevel: number) => {
    const fadeDuration = DURATION.win[questionLevel - 1] * 1000; // konwersja na ms
    SoundAPI.playWin(questionLevel, fadeDuration);
  }, []);

  /**
   * Odtwórz dźwięk przegranej z fade
   */
  const playLoseSound = React.useCallback((questionLevel: number) => {
    const fadeDuration = DURATION.lose[questionLevel - 1] * 1000; // konwersja na ms
    SoundAPI.playLose(questionLevel, fadeDuration);
  }, []);

  /**
   * Odtwórz dźwięk startu pytania z fade
   */
  const playStartSound = React.useCallback((questionLevel: number) => {
    const fadeDuration = DURATION.start[questionLevel - 1] * 1000; // konwersja na ms
    SoundAPI.playStart(questionLevel, fadeDuration);
  }, []);

  /**
   * Odtwórz dźwięk odpowiedzi z fade
   */
  const playAnswerSound = React.useCallback(() => {
    const fadeDuration = DURATION.answer * 1000; // konwersja na ms
    SoundAPI.playAnswer(fadeDuration);
  }, []);

  /**
   * Odtwórz sekwencję dźwięków wyników
   */
  const playResultSequence = React.useCallback(
    (isCorrect: boolean, questionLevel: number) => {
      const fadeDuration = isCorrect
        ? DURATION.win[questionLevel - 1] * 1000
        : DURATION.lose[questionLevel - 1] * 1000;

      SoundAPI.playResultSequence(isCorrect, questionLevel, fadeDuration);
    },
    []
  );

  /**
   * Zatrzymaj wszystkie dźwięki
   */
  const stopAllSounds = React.useCallback(() => {
    SoundAPI.stopAll();
  }, []);

  return {
    // TYLKO 3 kluczowe momenty + cleanup:
    playStartSound, // 1. Nowe pytanie
    playAnswerSound, // 2. Zaznaczenie odpowiedzi
    playResultSequence, // 3. Efekt zaznaczenia (poprawne/niepoprawne)
    stopAllSounds, // Zatrzymanie (dla cleanup)

    // Pozostałe funkcje (nieużywane, ale dostępne)
    playWinSound,
    playLoseSound,
  };
}
