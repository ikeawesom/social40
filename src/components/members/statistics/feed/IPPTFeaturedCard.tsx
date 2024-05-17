import DefaultCard from "@/src/components/DefaultCard";
import HRow from "@/src/components/utils/HRow";
import { TimestampToDateString } from "@/src/utils/helpers/getCurrentDate";
import { IPPT_SCHEMA } from "@/src/utils/schemas/statistics";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function IPPTFeaturedCard({
  bestStat,
}: {
  bestStat: IPPT_SCHEMA;
}) {
  const gold = bestStat.score >= 85;
  const silver = !gold && bestStat.score >= 75;
  return (
    <DefaultCard
      className={twMerge(
        "w-full relative overflow-hidden",
        gold ? "bg-yellow-400" : silver ? "bg-gray-300" : "bg-[#b08d57]"
      )}
    >
      <div className="flex flex-col items-start justify-start text-custom-dark-text">
        <div className="w-full flex items-center justify-between">
          <div className="flex flex-col items-start justify-start">
            <h1 className="font-bold text-2xl">IPPT</h1>
            <p className="text-xs">
              Completed on{" "}
              {TimestampToDateString(bestStat.dateCompleted).split(" ")[0]}
            </p>
          </div>
          <h1 className="text-4xl font-bold">{bestStat.score}</h1>
        </div>
        <HRow className="my-2 bg-custom-dark-text/50 h-[1px]" />
        <div className="shimmer slow" />
        <p className="text-sm">
          <span className="font-bold">{bestStat.stats.pushups}</span> Push Ups
        </p>
        <p className="text-sm">
          <span className="font-bold">{bestStat.stats.situps}</span> Sit Ups
        </p>
        <p className="text-sm">
          <span className="font-bold">
            {Math.floor(bestStat.stats.timing / 60)} min{" "}
            {Math.floor(bestStat.stats.timing % 60)} sec
          </span>{" "}
          for 2.4km
        </p>
        <div className="w-full flex items-center justify-end">
          <p className="text-xs">
            Verified by: {bestStat.addedBy ?? bestStat.memberID}
          </p>
        </div>
      </div>
    </DefaultCard>
  );
}
