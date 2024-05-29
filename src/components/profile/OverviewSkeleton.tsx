import React from "react";
import DefaultSkeleton from "../utils/DefaultSkeleton";

export default function OverviewSkeleton() {
  return (
    <div className="flex items-center justify-start flex-col w-full gap-1">
      <h1 className="text-xl mb-2 font-bold text-center text-custom-dark-text">
        Overview
      </h1>
      <DefaultSkeleton className="rounded-full w-[120px] h-[120px] mb-2" />
      <div className="flex items-center justify-center gap-4 my-2 w-full">
        <DefaultSkeleton className="flex-1 h-[20px]" />
        <DefaultSkeleton className="flex-1 h-[20px]" />
      </div>
    </div>
  );
}
