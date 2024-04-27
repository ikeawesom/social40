import React from "react";
import DefaultSkeleton from "@/src/components/utils/DefaultSkeleton";
import HeaderBar from "@/src/components/navigation/HeaderBar";

export default function loading() {
  return (
    <>
      <HeaderBar text="All Statuses" back />
      <div className="w-full grid place-items-center">
        <div className="flex flex-col w-full items-start justify-start gap-2 max-w-[500px]">
          <DefaultSkeleton className="h-[60px] mb-2" />
          <DefaultSkeleton className="h-[20px] w-[200px]" />
          <DefaultSkeleton className="h-[80px]" />
          <DefaultSkeleton className="h-[80px]" />
          <DefaultSkeleton className="h-[80px] mb-4" />
          <DefaultSkeleton className="h-[20px] w-[200px]" />
          <DefaultSkeleton className="h-[80px]" />
          <DefaultSkeleton className="h-[80px]" />
          <DefaultSkeleton className="h-[80px] mb-4" />
          <DefaultSkeleton className="h-[20px] w-[200px]" />
          <DefaultSkeleton className="h-[80px]" />
          <DefaultSkeleton className="h-[80px]" />
          <DefaultSkeleton className="h-[80px] mb-4" />
          <DefaultSkeleton className="h-[20px] w-[200px]" />
          <DefaultSkeleton className="h-[80px]" />
          <DefaultSkeleton className="h-[80px]" />
          <DefaultSkeleton className="h-[80px] mb-4" />
        </div>
      </div>
    </>
  );
}
