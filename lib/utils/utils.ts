import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatuje dane do logowania
 */
export function formatLogData(
  action: string,
  details: Record<string, unknown>
): {
  action: string;
  data: {
    type: string;
    details: Record<string, unknown>;
    timestamp: Date;
  };
} {
  return {
    action: "log-player-action",
    data: {
      type: action,
      details,
      timestamp: new Date(),
    },
  };
}
