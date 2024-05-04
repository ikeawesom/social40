import React from "react";
import DefaultSkeleton from "../../utils/DefaultSkeleton";

export default function StatisticSkeleton() {
  return (
    <div className="w-full flex flex-col items-start justify-start gap-2">
      <DefaultSkeleton className="w-full max-w-[100px] h-[10px]" />
      <DefaultSkeleton className="w-full h-[100px]" />
      <DefaultSkeleton className="w-full max-w-[100px] h-[10px] mt-4" />
      <DefaultSkeleton className="w-full h-[20px]" />
    </div>
  );
}
