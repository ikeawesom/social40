import CenterFeedSkeleton from "@/src/components/utils/CenterFeedSkeleton";
import React from "react";

export default function GroupHALoadingSkeleton() {
  return (
    <div className="w-full grid place-items-center">
      <div className="flex flex-col w-full items-center justify-start gap-2 max-w-[500px]">
        <CenterFeedSkeleton height="h-[8vh]" />
      </div>
    </div>
  );
}
