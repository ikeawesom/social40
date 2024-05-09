import DefaultSkeleton from "@/src/components/utils/DefaultSkeleton";
import { PodiumType } from "@/src/utils/constants";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function PodiumSkeleton() {
  return (
    <div className="w-full flex items-center justify-evenly mt-6">
      <PodiumMemberSkeleton type="SILVER" />
      <PodiumMemberSkeleton type="GOLD" />
      <PodiumMemberSkeleton type="BRONZE" />
    </div>
  );
}

export function PodiumMemberSkeleton({ type }: { type: PodiumType | string }) {
  const isBest = type === "GOLD";
  return (
    <div className="items-center justify-center flex-col flex gap-5">
      <DefaultSkeleton
        className={twMerge(
          "overflow-hidden rounded-full shadow-lg relative flex items-center justify-center border-[3px]",
          isBest
            ? "min-[400px]:w-[100px] min-[400px]:h-[100px] w-[90px] h-[90px]"
            : type === "SILVER"
            ? "min-[400px]:w-[80px] min-[400px]:h-[80px] w-[70px] h-[70px]"
            : "min-[400px]:w-[80px] min-[400px]:h-[80px] w-[70px] h-[70px]"
        )}
      />
      <div className="flex flex-col items-center justify-center">
        <DefaultSkeleton className="h-[10px] w-[100px]" />
        <DefaultSkeleton className="h-[10px] w-[50px]" />
      </div>
    </div>
  );
}
