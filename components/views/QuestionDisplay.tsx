"use client";

// 
import Image from "next/image";
// import { Textfit } from "react-textfit";
import { useRef, useLayoutEffect, useState, CSSProperties, ReactNode } from "react";
// Prosty zamiennik Textfit do jednowierszowego tekstu
interface AutoFontSizeProps {
  min?: number;
  max?: number;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  fontFamily?: string;
}

function AutoFontSize({
  min = 10,
  max = 30,
  children,
  style,
  className = "",
  fontFamily,
}: AutoFontSizeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(max);

  useLayoutEffect(() => {
    if (!containerRef.current || !textRef.current) return;
    const container = containerRef.current;
    const text = textRef.current;
    let current = max;
    text.style.fontSize = `${current}px`;
    const fits = () => text.scrollWidth <= container.offsetWidth && text.offsetHeight <= container.offsetHeight;
    while (current > min && !fits()) {
      current -= 1;
      text.style.fontSize = `${current}px`;
    }
    setFontSize(current);
  }, [children, min, max, style]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", ...style, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily }}
      className={className}
    >
      <span ref={textRef} style={{ fontSize, width: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {children}
      </span>
    </div>
  );
}
import { IMAGES } from "@/lib/utils/game-assets";
import { Coiny } from "next/font/google";
import type { Question } from "@/types/question";

const COINY = Coiny({
  subsets: ["latin"],
  weight: ["400"],
});

// const INTER = Inter({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

export interface QuestionDisplayProps {
  currentQuestion: Question | null;
  showGameContent: boolean;
  isTransitioning: boolean;
  showWinScreen: boolean;
  currentPrize?: string;
  displayQuestionText?: string;
}

export function QuestionDisplay({
  currentQuestion,
  showGameContent,
  isTransitioning,
  showWinScreen,
  currentPrize,
  displayQuestionText,
}: QuestionDisplayProps) {
  if (!currentQuestion) return null;

  return (
    <div
      className={`relative transition-all duration-500 ease-in-out bg-cover bg-center bg-no-repeat ${
        !showGameContent
          ? "opacity-0"
          : isTransitioning
          ? "opacity-75"
          : "opacity-100"
      }`}
      style={{
        backgroundImage: `url(${IMAGES.QUESTION_BACKGROUND})`,
      }}
    >
      {/* Niewidoczny obrazek dla wymiarów */}
      <Image
        src={IMAGES.QUESTION_BACKGROUND}
        width={1920}
        height={400}
        alt="Pytanie"
        className="w-full invisible"
        draggable={false}
      />

      <div className="absolute top-[31%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-[9%] h-[15%] flex items-center justify-center">
        <AutoFontSize
          min={10}
          max={30}
          style={COINY.style}
          className={` ${showWinScreen ? "text-green-400" : "text-white"}`}
          fontFamily={COINY.style.fontFamily as string}
        >
          {showWinScreen ? "WYGRANA" : currentPrize}
        </AutoFontSize>
      </div>
      

      <div className="absolute top-[55%] -translate-y-1/2 h-[40%] left-1/2 -translate-x-1/2 w-[76%] flex items-center justify-center">
        <AutoFontSize
          min={20}
          max={50}
          style={{ width: "100%", height: "100%", fontWeight: 700 }}
          className="text-white font-bold"
        >
          {displayQuestionText}
        </AutoFontSize>
      </div>
    </div>
  );
}
