"use client";

import React from "react";
import Image from "next/image";

export default function CalendarHeading({
  back,
  forward,
  text,
}: {
  text: string;
  forward: () => void;
  back: () => void;
}) {
  return (
    <div className="w-full flex items-center justify-between">
      <Image
        alt="Before"
        src="/icons/icon_arrow-down.svg"
        width={25}
        height={25}
        className="rotate-90 cursor-pointer hover:opacity-70 duration-150"
        onClick={back}
      />
      <h1 className="font-bold text-center text-custom-dark-text fade-in-bottom">
        {text}
      </h1>
      <Image
        alt="Before"
        src="/icons/icon_arrow-down.svg"
        width={25}
        height={25}
        className="-rotate-90 cursor-pointer hover:opacity-70 duration-150"
        onClick={forward}
      />
    </div>
  );
}
