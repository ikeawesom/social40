import React from "react";
import DefaultSkeleton from "./utils/DefaultSkeleton";

export default function FeedSkeleton() {
  return (
    <div className="flex flex-col w-full items-center justify-start gap-4 max-w-[500px]">
      <DefaultSkeleton />
      <DefaultSkeleton />
      <DefaultSkeleton />
    </div>
  );
}
