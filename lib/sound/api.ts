// API do zarządzania dźwiękami w aplikacji
// Używa custom events do komunikacji między komponentami

export type SoundEventType =
  | "play-sound"
  | "stop-sound"
  | "stop-all-sounds"
  | "sound-started"
  | "sound-ended";

export interface SoundEventData {
  type?: string; // rodzaj dźwięku (win, lose, start, answer, lightsdown)
  soundPath?: string; // ścieżka do pliku dźwiękowego
  questionLevel?: number; // poziom pytania (1-12)
  fadeDuration?: number; // czas fade (opcjonalne)
  fadeOut?: boolean; // czy ma być fade out
}

class SoundAPI {
  private static readonly EVENT_PREFIX = "sound:";

  /**
   * Odtwórz dźwięk
   */
  static play(data: SoundEventData): void {
    const event = new CustomEvent(`${this.EVENT_PREFIX}play-sound`, {
      detail: data,
    });
    window.dispatchEvent(event);
  }

  /**
   * Zatrzymaj konkretny dźwięk
   */
  static stop(data?: SoundEventData): void {
    const event = new CustomEvent(`${this.EVENT_PREFIX}stop-sound`, {
      detail: data || {},
    });
    window.dispatchEvent(event);
  }

  /**
   * Zatrzymaj wszystkie dźwięki
   */
  static stopAll(): void {
    const event = new CustomEvent(`${this.EVENT_PREFIX}stop-all-sounds`, {
      detail: {},
    });
    window.dispatchEvent(event);
  }

  /**
   * Nasłuchuj na eventy dźwięków
   */
  static addEventListener(
    type: SoundEventType,
    listener: (data: SoundEventData) => void
  ): () => void {
    const eventName = `${this.EVENT_PREFIX}${type}`;

    const handler = (event: CustomEvent) => {
      listener(event.detail || {});
    };

    window.addEventListener(eventName, handler as EventListener);

    // Zwróć funkcję cleanup
    return () => {
      window.removeEventListener(eventName, handler as EventListener);
    };
  }

  /**
   * Emit custom sound event
   */
  static emit(type: SoundEventType, data?: SoundEventData): void {
    const event = new CustomEvent(`${this.EVENT_PREFIX}${type}`, {
      detail: data || {},
    });
    window.dispatchEvent(event);
  }

  /**
   * Odtwórz dźwięk wygranej
   */
  static playWin(questionLevel: number, fadeDuration?: number): void {
    this.play({
      type: "win",
      questionLevel,
      fadeDuration,
    });
  }

  /**
   * Odtwórz dźwięk przegranej
   */
  static playLose(questionLevel: number, fadeDuration?: number): void {
    this.play({
      type: "lose",
      questionLevel,
      fadeDuration,
    });
  }

  /**
   * Odtwórz dźwięk startu pytania
   */
  static playStart(questionLevel: number, fadeDuration?: number): void {
    this.play({
      type: "start",
      questionLevel,
      fadeDuration,
    });
  }

  /**
   * Odtwórz dźwięk odpowiedzi
   */
  static playAnswer(fadeDuration?: number): void {
    this.play({
      type: "answer",
      fadeDuration,
    });
  }

  /**
   * Odtwórz dźwięk ściemniania świateł
   */
  static playLightsDown(): void {
    this.play({
      type: "lightsdown",
    });
  }

  /**
   * Odtwórz sekwencję dźwięków wyników (lights down → win/lose)
   */
  static playResultSequence(
    isCorrect: boolean,
    questionLevel: number,
    fadeDuration?: number
  ): void {
    // Zatrzymaj wszystkie dźwięki
    this.stopAll();

    // Odtwórz lights down
    this.playLightsDown();

    // Po 1 sekundzie odtwórz wynik
    setTimeout(() => {
      if (isCorrect) {
        this.playWin(questionLevel, fadeDuration);
      } else {
        this.playLose(questionLevel, fadeDuration);
      }
    }, 1000);
  }
}

export { SoundAPI };
