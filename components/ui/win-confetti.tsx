"use client";


import Confetti from "react-confetti";
import * as React from "react";
interface WinConfettiOverlayProps {
  run: boolean;
  pieces?: number;
}

export function WinConfettiOverlay({
  run,
  pieces = 500,
}: WinConfettiOverlayProps) {
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const update = () => {
      if (typeof window !== "undefined") {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!run || size.width === 0 || size.height === 0) return null;

  return (
    <Confetti
      width={size.width}
      height={size.height}
      recycle={false}
      numberOfPieces={pieces}
      gravity={0.3}
    />
  );
}
