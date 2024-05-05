import { DEFAULT_STATS } from "@/src/utils/constants";
import React from "react";
import DefaultSkeleton from "../../utils/DefaultSkeleton";

export default function StatsLoading() {
  return (
    <div className="flex items-center justify-around gap-3 w-full">
      {Object.keys(DEFAULT_STATS)
        .filter((type: string) => DEFAULT_STATS[type].featured)
        .map((type: string) => (
          <DefaultSkeleton key={type} className="w-[50px] h-[50px]" />
        ))}
    </div>
  );
}
