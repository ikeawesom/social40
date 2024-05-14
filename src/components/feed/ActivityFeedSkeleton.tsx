import React from "react";
import FeedGroupCardSkeleton from "./FeedGroupCardSkeleton";

export default function ActivityFeedSkeleton() {
  return (
    <div className="flex flex-col w-full items-center justify-start gap-4 max-w-[500px]">
      <FeedGroupCardSkeleton />
      <FeedGroupCardSkeleton />
      <FeedGroupCardSkeleton />
      <FeedGroupCardSkeleton />
      <FeedGroupCardSkeleton />
      <FeedGroupCardSkeleton />
    </div>
  );
}
