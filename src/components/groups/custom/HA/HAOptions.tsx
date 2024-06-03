"use client";
import DefaultCard from "@/src/components/DefaultCard";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import { useRouter } from "next/navigation";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function HAOptions({ type }: { type: string }) {
  const router = useRouter();
  const [HAType, setHAType] = useState(type);

  return (
    <>
      <DefaultCard className="bg-white/50 flex items-center justify-center gap-3 w-full">
        <SecondaryButton
          onClick={() => {
            setHAType("group");
            router.push(`?${new URLSearchParams({ type: "group" })}`, {
              scroll: false,
            });
          }}
          className={twMerge(
            "self-stretch",
            HAType === "group" &&
              "border-custom-orange bg-custom-light-orange text-custom-orange font-bold"
          )}
        >
          Group
        </SecondaryButton>

        <SecondaryButton
          onClick={() => {
            setHAType("indiv");
            router.push(`?${new URLSearchParams({ type: "indiv" })}`, {
              scroll: false,
            });
          }}
          className={twMerge(
            "self-stretch",
            HAType === "indiv" &&
              "border-custom-orange bg-custom-light-orange text-custom-orange font-bold"
          )}
        >
          Individual
        </SecondaryButton>
      </DefaultCard>
    </>
  );
}
