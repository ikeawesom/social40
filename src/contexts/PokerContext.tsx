"use client";
import { createContext, useContext, useState } from "react";
import { PokerRoomType } from "../utils/schemas/pokerGame";

export type PokerGameType = {
  gameStage: string;
  curPlayer: string;
  room: PokerRoomType;
};

export type PokerContextType = {
  gameState: PokerGameType | null;
  setGameState: React.Dispatch<React.SetStateAction<PokerGameType | null>>;
};

export const PokerContext = createContext<PokerContextType | null>(null);

export function PokerProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<PokerGameType | null>(null);

  return (
    <PokerContext.Provider value={{ gameState, setGameState }}>
      {children}
    </PokerContext.Provider>
  );
}

export function usePokerState() {
  const ctx = useContext(PokerContext);
  if (!ctx) {
    throw new Error("usePokerState must be used within a PokerProvider");
  }
  return ctx;
}
