"use client";


import Image from "next/image";
import { IMAGES } from "@/lib/utils/game-assets";

export function WinTransitionScreen() {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${IMAGES.BACKGROUND})` }}
    >
      {/* EKRAN PRZEJŚCIOWY DO WYGRANEJ */}
      <div className="fixed inset-0 z-[9999] transition-screen-overlay bg-black/20">
        <div className="min-h-screen flex items-center justify-center">
          <div className="transition-screen-logo">
            <Image
              src={IMAGES.LOGO}
              alt="Logo Milionerzy"
              width={600}
              height={300}
              className="drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
