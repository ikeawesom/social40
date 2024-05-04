import DefaultCard from "@/src/components/DefaultCard";
import { DEFAULT_STATS } from "@/src/utils/constants";
import { TimestampToDateString } from "@/src/utils/getCurrentDate";
import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function DefaultFeaturedCard({
  data,
  type,
}: {
  data: any;
  type: string;
}) {
  const special = DEFAULT_STATS[type].criteria;
  const ATPSpecial = type === "ATP" && data.score >= special.mm;
  const score = DEFAULT_STATS[type].timing
    ? `${Math.floor(Number(data.score) / 60)} min
  ${Math.floor(Number(data.score) % 60)} sec`
    : data.score;

  return (
    <DefaultCard
      className={twMerge(
        "w-full relative overflow-hidden bg-gradient-to-b from-white to-gray-200"
      )}
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col items-start justify-start">
          <h1 className="font-bold text-2xl">{type}</h1>

          <p className="text-xs">
            Completed on{" "}
            {TimestampToDateString(data.dateCompleted).split(" ")[0]}
          </p>
        </div>
        <div className="flex items-center justify-start gap-1 text-end">
          <h1 className="text-4xl font-bold">{score}</h1>
          {ATPSpecial ? (
            <Image
              alt="Marksman"
              src="/icons/features/icon_crosshair.svg"
              width={40}
              height={40}
              className="mb-[3px]"
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="shimmer slow" />
    </DefaultCard>
  );
}
