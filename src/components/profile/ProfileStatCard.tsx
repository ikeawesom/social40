import React from "react";
import { twMerge } from "tailwind-merge";
import DefaultCard from "../DefaultCard";

export interface ProfileStatType {
  value: number;
  config: { first: number; second: number; higherBetter?: boolean };
}

export default function ProfileStatCard({ config, value }: ProfileStatType) {
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
      className={twMerge(
        "border-l-8 py-2 px-3 flex items-center justify-end gap-2",
        color
      )}
    >
      {value}
    </DefaultCard>
  );
}
