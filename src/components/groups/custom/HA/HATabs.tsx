"use client";
import DefaultCard from "@/src/components/DefaultCard";
import HRow from "@/src/components/utils/HRow";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import { isHAType } from "@/src/utils/schemas/ha";
import Link from "next/link";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function HATabs({
  HAmembers,
  normalMembers,
}: {
  HAmembers: isHAType[];
  normalMembers: isHAType[];
}) {
  const [memberType, setMemberType] = useState("HA");

  return (
    <>
      <div className="flex items-center justify-center gap-3 w-full mt-4">
        <SecondaryButton
          onClick={() => setMemberType("HA")}
          className={twMerge(
            "self-stretch",
            memberType === "HA" &&
              "border-custom-orange bg-custom-light-orange text-custom-orange font-bold"
          )}
        >
          HA Members ({HAmembers.length})
        </SecondaryButton>

        <SecondaryButton
          onClick={() => setMemberType("normal")}
          className={twMerge(
            "self-stretch",
            memberType === "normal" &&
              "border-custom-orange bg-custom-light-orange text-custom-orange font-bold"
          )}
        >
          Non-HA Members ({normalMembers.length})
        </SecondaryButton>
      </div>
      <HRow />
      {memberType === "HA"
        ? HAmembers.map((item: isHAType, index: number) => {
            const { displayName, id, isHA } = item;
            return (
              <Link href={`/members/${id}`} key={index} className="w-full">
                <DefaultCard className="w-full duration-150 hover:bg-custom-light-text py-2 px-3">
                  <h1
                    className={twMerge("font-bold", !isHA && "text-custom-red")}
                  >
                    {displayName}
                  </h1>
                  <p className="text-sm text-custom-grey-text">{id}</p>
                </DefaultCard>
              </Link>
            );
          })
        : normalMembers.map((item: isHAType, index: number) => {
            const { displayName, id, isHA } = item;
            return (
              <Link href={`/members/${id}`} key={index} className="w-full">
                <DefaultCard className="w-full duration-150 hover:bg-custom-light-text py-2 px-3">
                  <h1
                    className={twMerge("font-bold", !isHA && "text-custom-red")}
                  >
                    {displayName}
                  </h1>
                  <p className="text-sm text-custom-grey-text">{id}</p>
                </DefaultCard>
              </Link>
            );
          })}
    </>
  );
}
