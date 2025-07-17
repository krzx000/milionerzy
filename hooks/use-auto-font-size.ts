"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface AutoFontSizeOptions {
  maxFontSize?: number;
  minFontSize?: number;
  step?: number;
}

export function useAutoFontSize(
  text: string,
  options: AutoFontSizeOptions = {}
) {
  const { maxFontSize = 100, minFontSize = 16, step = 2 } = options;

  const [fontSize, setFontSize] = useState(maxFontSize);
  const ref = useRef<HTMLDivElement>(null);

  const calculateOptimalFontSize = useCallback(() => {
    if (!ref.current || !text) {
      setFontSize(maxFontSize);
      return;
    }

    const element = ref.current;
    const parent = element.parentElement;

    if (!parent) return;

    // Zmierz dostępną przestrzeń
    const availableWidth = parent.clientWidth * 0.9; // 90% szerokości
    const availableHeight = parent.clientHeight * 0.9; // 90% wysokości

    let currentSize = maxFontSize;

    // Tymczasowo ustaw tekst i testuj rozmiary
    element.style.fontSize = `${currentSize}px`;
    element.style.visibility = "hidden";
    element.style.position = "absolute";
    element.style.whiteSpace = "nowrap";

    // Zmniejszaj rozmiar dopóki tekst się nie zmieści
    while (currentSize >= minFontSize) {
      element.style.fontSize = `${currentSize}px`;

      const textWidth = element.scrollWidth;
      const textHeight = element.scrollHeight;

      if (textWidth <= availableWidth && textHeight <= availableHeight) {
        break;
      }

      currentSize -= step;
    }

    // Przywróć normalne style
    element.style.visibility = "";
    element.style.position = "";
    element.style.whiteSpace = "";

    setFontSize(Math.max(currentSize, minFontSize));
  }, [text, maxFontSize, minFontSize, step]);

  useEffect(() => {
    calculateOptimalFontSize();

    // Nasłuchuj zmian rozmiaru okna
    const handleResize = () => {
      setTimeout(calculateOptimalFontSize, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateOptimalFontSize]);

  return { ref, fontSize };
}
