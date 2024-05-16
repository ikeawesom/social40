"use client";

import { DEFAULT_STATS } from "@/src/utils/constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function StatsScrollSection({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const paramID = searchParams.get("type");
  const [curStat, setCurStat] = useState(paramID ?? "IPPT");

  return (
    <div className="w-full">
      <div className="flex items-center justify-start gap-x-4 overflow-x-scroll py-2 pr-6 pl-2 w-full">
        {Object.keys(DEFAULT_STATS).map((type: string) => {
          const stat = DEFAULT_STATS[type];
          const { name } = stat;
          return (
            <Link
              scroll={false}
              key={name}
              href={`/members/${id}/statistics?${new URLSearchParams({
                type: name,
              })}`}
              onClick={() => setCurStat(name)}
              className={twMerge(
                "self-stretch w-fit rounded-lg px-2 py-1 flex text-sm items-center justify-center text-center bg-white text-custom-dark-text shadow-md duration-150",
                curStat === name
                  ? "bg-custom-primary text-custom-light-text hover:brightness-105"
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
