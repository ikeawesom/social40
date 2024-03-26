"use client";
import Image from "next/image";
import React from "react";

export default function PokerCanvas() {
  return (
    <Image
      className="object-contain bg-black"
      fill={true}
      alt="Poker"
      src="/images/games/poker/game-background.svg"
    />
  );
}
