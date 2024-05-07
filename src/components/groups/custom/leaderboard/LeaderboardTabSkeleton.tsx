import DefaultSkeleton from "@/src/components/utils/DefaultSkeleton";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function LeaderboardTabSkeleton({
  isBest,
}: {
  isBest?: boolean;
}) {
  return (
    <div className="flex items-center justify-start gap-4">
      <DefaultSkeleton
        className={twMerge(
          "rounded-full shadow-lg relative flex items-center justify-center",
          isBest ? "w-[70px] h-[70px]" : "w-[50px] h-[50px]"
        )}
      />
      <div>
        <DefaultSkeleton className="w-[100px] h-[5px] mb-2" />
        <DefaultSkeleton className="w-[70px] h-[5px]" />
      </div>
    </div>
  );
}
