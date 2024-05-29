import React from "react";
import DefaultSkeleton from "../utils/DefaultSkeleton";

export default function ProfileListSkeleton({ search }: { search?: boolean }) {
  return (
    <div className="flex items-start justify-start flex-col w-full gap-4">
      <div className="flex items-start justify-start flex-col w-full gap-1">
        <DefaultSkeleton className="w-[200px] h-[10px]" />
        {search && <DefaultSkeleton className="h-[10px]" />}
        <DefaultSkeleton className="h-[10vh]" />
        <DefaultSkeleton className="h-[10vh]" />
        <DefaultSkeleton className="h-[10vh]" />
      </div>
      <div className="flex items-start justify-start flex-col w-full gap-1">
        <DefaultSkeleton className="w-[200px] h-[10px]" />
        {search && <DefaultSkeleton className="h-[10px]" />}
        <DefaultSkeleton className="h-[10vh]" />
        <DefaultSkeleton className="h-[10vh]" />
        <DefaultSkeleton className="h-[10vh]" />
      </div>
    </div>
  );
}
