import React from "react";
import PodiumSkeleton from "./PodiumSkeleton";
import DefaultSkeleton from "@/src/components/utils/DefaultSkeleton";

export default function LeaderboardPageSkeleton() {
  return (
    <div className="flex-col flex w-full items-start justify-start gap-4">
      <PodiumSkeleton />
      <div className="w-full flex items-start justify-start gap-2 flex-col mt-6">
        <DefaultSkeleton className="h-[60px]" />
        <DefaultSkeleton className="h-[60px]" />
        <DefaultSkeleton className="h-[60px]" />
        <DefaultSkeleton className="h-[60px]" />
        <DefaultSkeleton className="h-[60px]" />
        <DefaultSkeleton className="h-[60px]" />
      </div>
    </div>
  );
}
