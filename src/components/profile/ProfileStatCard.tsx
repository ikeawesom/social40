import React from "react";
import { twMerge } from "tailwind-merge";
import DefaultCard from "../DefaultCard";
import Image from "next/image";

export interface ProfileStatType {
  value: number;
  config: { first: number; second: number; higherBetter?: boolean };
  onClick?: () => void;
}

export default function ProfileStatCard({
  config,
  value,
  onClick,
}: ProfileStatType) {
  const { first, second, higherBetter } = config;
  const color = higherBetter
    ? value > first
      ? "border-l-custom-green"
      : value > second
      ? "border-l-custom-orange"
      : "border-l-custom-red"
    : value < first
    ? "border-l-custom-green"
    : value < second
    ? "border-l-custom-orange"
    : "border-l-custom-red";

  return (
    <DefaultCard
      onClick={onClick}
      className={twMerge(
        "border-l-8 py-2 px-3 flex items-center justify-between gap-2",
        color,
        onClick && "cursor-pointer hover:brightness-95 duration-150"
      )}
    >
      {value}
      {onClick && (
        <Image
          alt="View"
          src="/icons/icon_arrow-down.svg"
          width={20}
          height={20}
          className="-rotate-90"
        />
      )}
    </DefaultCard>
  );
}
