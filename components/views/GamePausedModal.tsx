"use client";

export interface GamePausedModalProps {
  isPaused: boolean;
}

export function GamePausedModal({ isPaused }: GamePausedModalProps) {
  if (!isPaused) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-white p-8 rounded text-center">
        <h2 className="text-2xl font-bold mb-4">Gra wstrzymana</h2>
        <p>Oczekiwanie na wznowienie...</p>
      </div>
    </div>
  );
}
