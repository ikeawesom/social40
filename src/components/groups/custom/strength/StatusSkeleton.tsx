import DefaultSkeleton from "@/src/components/utils/DefaultSkeleton";
import React from "react";

export default function StrengthSkeleton() {
  return (
    <div className="w-full flex flex-col items-start justify-start gap-1">
      <DefaultSkeleton className="h-[10px] w-[100px]" />
      <DefaultSkeleton className="h-[10px] w-[80px]" />
      <DefaultSkeleton className="h-[8px] w-[100px]" />
    </div>
  );
}
