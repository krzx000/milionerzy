export const logger = {
  debug: (...args: unknown[]) => {
    if (process.env.NEXT_PUBLIC_DEBUG === "true") {
      console.log(...args);
    }
  },
  error: (...args: unknown[]) => {
    console.error(...args);
  },
  warn: (...args: unknown[]) => {
    if (process.env.NEXT_PUBLIC_DEBUG === "true") {
      console.warn(...args);
    }
  },
};
