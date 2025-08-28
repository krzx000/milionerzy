"use client";

import { AudioPlayerProvider } from "react-use-audio-player";

interface AudioProviderProps {
  children: React.ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  return <AudioPlayerProvider>{children}</AudioPlayerProvider>;
}
