"use client";

import { LeaderboardCatType } from "@/src/utils/constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function LeaderboardScollSection({
  filteredStats,
  groupID,
}: {
  groupID: string;
  filteredStats: LeaderboardCatType;
}) {
  const searchParams = useSearchParams();
  const paramID = searchParams.get("type");
  const [curStat, setCurStat] = useState(paramID ?? "OVERALL");

  return (
    <div className="w-full">
      <div className="flex items-center justify-start gap-x-4 overflow-x-scroll py-2 pr-6 pl-2 w-full">
        {Object.keys(filteredStats).map((type: string) => {
          const stat = filteredStats[type];
          const { name } = stat;
          return (
            <Link
              scroll={false}
              key={name}
              href={`/groups/${groupID}/leaderboard?${new URLSearchParams({
                type,
              })}`}
              onClick={() => setCurStat(name)}
              className={twMerge(
                "self-stretch w-full whitespace-nowrap rounded-lg px-4 py-2 flex items-center justify-center text-center bg-white text-custom-dark-text shadow-md duration-150",
                curStat === name
                  ? "bg-custom-primary text-custom-light-text hover:brightness-105 font-bold"
                  : "hover:bg-custom-light-text"
              )}
            >
              {name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
