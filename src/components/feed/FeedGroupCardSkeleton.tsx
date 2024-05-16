import React from "react";
import DefaultCard from "../DefaultCard";
import HRow from "../utils/HRow";
import DefaultSkeleton from "../utils/DefaultSkeleton";

export default function FeedGroupCardSkeleton() {
  return (
    <DefaultCard className="w-full flex flex-col items-start justify-start">
      <DefaultSkeleton className="h-[5px] w-[150px]" />
      <HRow className="mb-2" />
      <div className="w-full flex items-center justify-between flex-wrap gap-2">
        <DefaultSkeleton className="h-[10px] w-[150px]" />
        <DefaultSkeleton className="h-[5px] w-[20px]" />
      </div>
      <DefaultSkeleton className="w-[80px] h-[5px] mt-2" />
      <DefaultSkeleton className="h-[5px] mt-2" />
      <div className="w-full mt-2 flex items-center justify-end gap-3 max-[350px]:flex-wrap">
        <DefaultSkeleton className="min-[390px]:w-[70%] h-[20px]" />
        <DefaultSkeleton className="w-[30%] h-[20px]" />
      </div>
    </DefaultCard>
  );
}
