"use client";

import DefaultCard from "@/src/components/DefaultCard";
import { TimestampToDateString } from "@/src/utils/helpers/getCurrentDate";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

export default function IPPTFeedCard({
  data,
  id,
  type,
}: {
  type: string;
  data: any;
  id: string;
}) {
  const [show, setShow] = useState(false);
  const gold = data.score >= 85;
  const silver = !gold && data.score >= 75;
  return (
    <DefaultCard className="w-full">
      <div className="w-full flex items-center justify-between gap-2">
        <div>
          <h1>{type}</h1>

          <p className="text-xs text-custom-grey-text">
            {TimestampToDateString(data.dateCompleted).split(" ")[0]}
          </p>
        </div>
        <div className="flex items-center justify-end gap-2">
          {(gold || silver) && (
            <Image
              alt="award"
              src={
                gold
                  ? "/icons/features/icon_medal_gold.svg"
                  : "/icons/features/icon_medal_silver.svg"
              }
              width={20}
              height={20}
            />
          )}
          <h1 className="text-xl font-bold">{data.score}</h1>
        </div>
      </div>
      <div className="w-full flex items-center justify-end">
        <p
          onClick={() => setShow(!show)}
          className={twMerge(
            "text-xs underline cursor-pointer",
            show ? "text-custom-primary" : "text-custom-grey-text"
          )}
        >
          {show ? "Hide" : "View Stats"}
        </p>
      </div>
      {show && (
        <>
          <p className="text-sm">
            <span className="font-bold">{data.stats.pushups}</span> Push Ups
          </p>
          <p className="text-sm">
            <span className="font-bold">{data.stats.situps}</span> Sit Ups
          </p>
          <p className="text-sm">
            <span className="font-bold">
              {Math.floor(data.stats.timing / 60)} min{" "}
              {Math.floor(data.stats.timing % 60)} sec
            </span>{" "}
            for 2.4km
          </p>
        </>
      )}
    </DefaultCard>
  );
}
