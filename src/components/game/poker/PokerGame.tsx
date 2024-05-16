"use client";

import React, { useEffect } from "react";
import PokerCanvas from "./PokerCanvas";
import { PokerMenuForm } from "./PokerMenuForm";
import { usePokerState } from "@/src/contexts/PokerContext";
import { doc, onSnapshot } from "firebase/firestore";
import { FIREBASE_DB } from "@/src/firebase/db";
import getCurrentDate from "@/src/utils/helpers/getCurrentDate";
import { PokerRoomType } from "@/src/utils/schemas/pokerGame";
import PrimaryButton from "../../utils/PrimaryButton";

export default function PokerGame({ member }: { member: string }) {
  const { gameState, setGameState } = usePokerState();

  useEffect(() => {
    if (gameState === null) {
      setGameState({
        room: {
          createdBy: member,
          createdOn: getCurrentDate(),
          players: [{ hand: null, player: member }],
          roomCode: "",
        },
        curPlayer: member,
        gameStage: "init",
      });
    }
  }, []);

  if (gameState)
    return (
      <div className="bg-black">
        <PokerCanvas />
        {gameState?.gameStage === "init" && <PokerMenu />}
        {gameState?.gameStage === "create" && (
          <CreateRoomSection code={gameState.room.roomCode} />
        )}
      </div>
    );
}

export function CreateRoomSection({ code }: { code?: string }) {
  const { gameState, setGameState } = usePokerState();

  if (code && gameState) {
    const unsub = onSnapshot(doc(FIREBASE_DB, "GAME-POKER", code), (doc) => {
      const data = doc.data() as PokerRoomType;
      setGameState({
        ...gameState,
        room: { ...gameState.room, players: data.players },
      });
    });
  }

  return (
    <PokerCentralContainer>
      <p className="text-custom-light-text text-center">Room Code</p>
      <h1 className="text-6xl font-bold text-custom-light-text text-center">
        {gameState?.room.roomCode}
      </h1>
      <p>Players Joined: {gameState?.room.players.length}/6</p>
      <PrimaryButton
        disabled={gameState ? gameState.room.players.length < 2 : true}
      >
        Start Game
      </PrimaryButton>
    </PokerCentralContainer>
  );
}

export function PokerMenu() {
  return (
    <PokerCentralContainer>
      <h1 className="text-4xl text-custom-primary font-bold text-center">
        <span className="line-through">Social</span>{" "}
        <span className="text-custom-light-text">Poker</span>40
      </h1>
      <PokerMenuForm />
    </PokerCentralContainer>
  );
}

export function PokerCentralContainer({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-start gap-4 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
      {children}
    </div>
  );
}
