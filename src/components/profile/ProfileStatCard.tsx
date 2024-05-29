import React from "react";
import { twMerge } from "tailwind-merge";
import DefaultCard from "../DefaultCard";

export interface ProfileStatType {
  value: number;
  config: { first: number; second: number };
}

export default function ProfileStatCard({ config, value }: ProfileStatType) {
  return (
    <DefaultCard
      className={twMerge(
        "border-l-8 py-2 px-3 flex items-center justify-end gap-2",
        value < config.first
          ? "border-l-custom-green"
          : value < config.second
          ? "border-l-custom-orange"
          : "border-l-custom-red"
      )}
    >
      {value}
    </DefaultCard>
  );
}
