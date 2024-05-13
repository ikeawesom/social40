import DefaultSkeleton from "@/src/components/utils/DefaultSkeleton";
import React from "react";

export default function GroupHALoadingSkeleton() {
  return (
    <div className="w-full grid place-items-center">
      <div className="flex flex-col w-full items-center justify-start gap-2 max-w-[500px]">
        <div className="flex flex-col items-center justify-center gap-1">
          <DefaultSkeleton className="h-[20px] w-[200px]" />
          <DefaultSkeleton className="h-[5px] w-[100px]" />
          <DefaultSkeleton className="h-[8px] w-[100px] mt-3" />
        </div>
        <DefaultSkeleton className="h-[7vh]" />
        <DefaultSkeleton className="h-[7vh]" />
        <DefaultSkeleton className="h-[7vh]" />
        <DefaultSkeleton className="h-[7vh]" />
      </div>
    </div>
  );
}
