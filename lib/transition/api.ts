// API do zarządzania transition overlays w aplikacji
// Używa custom events do komunikacji między komponentami

export type TransitionEventType =
  | "show-transition"
  | "hide-transition"
  | "transition-shown"
  | "transition-hidden";

export interface TransitionEventData {
  type?: string; // rodzaj przejścia (opcjonalne)
  duration?: number; // czas trwania (opcjonalne)
}

import { TRANSITION_CONSTANTS } from "@/lib/constants/transitions";

class TransitionAPI {
  private static readonly EVENT_PREFIX = "transition:";

  /**
   * Pokaż transition overlay
   */
  static show(data?: TransitionEventData): void {
    const event = new CustomEvent(`${this.EVENT_PREFIX}show-transition`, {
      detail: data || {},
    });
    window.dispatchEvent(event);
  }

  /**
   * Ukryj transition overlay
   */
  static hide(data?: TransitionEventData): void {
    const event = new CustomEvent(`${this.EVENT_PREFIX}hide-transition`, {
      detail: data || {},
    });
    window.dispatchEvent(event);
  }

  /**
   * Nasłuchuj na eventy transition
   */
  static addEventListener(
    type: TransitionEventType,
    listener: (data: TransitionEventData) => void
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
   * Emit custom transition event
   */
  static emit(type: TransitionEventType, data?: TransitionEventData): void {
    const event = new CustomEvent(`${this.EVENT_PREFIX}${type}`, {
      detail: data || {},
    });
    window.dispatchEvent(event);
  }

  /**
   * Pokaż transition z automatycznym ukryciem po określonym czasie
   */
  static showTimed(
    duration: number = TRANSITION_CONSTANTS.DURATIONS.DEFAULT,
    data?: TransitionEventData
  ): void {
    this.show(data);

    setTimeout(() => {
      this.hide(data);
    }, duration);
  }

  /**
   * Pokaż transition, wykonaj callback, następnie ukryj
   */
  static showWithCallback(
    callback: () => void | Promise<void>,
    showDuration: number = TRANSITION_CONSTANTS.DURATIONS.SHORT,
    data?: TransitionEventData
  ): void {
    this.show(data);

    // Callback wykonuje się w połowie trwania transition
    setTimeout(async () => {
      await callback();
    }, showDuration / 2);

    // Transition kończy się po pełnym czasie showDuration
    setTimeout(() => {
      this.hide(data);
    }, showDuration);
  }
}

export { TransitionAPI };
