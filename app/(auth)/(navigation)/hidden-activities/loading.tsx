import FeedSkeleton from "@/src/components/FeedSkeleton";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import React from "react";

export default function loading() {
  return (
    <>
      <HeaderBar text="Hidden Activities" back />
      <div className="w-full grid place-items-center">
        <div className="flex flex-col w-full items-start justify-start gap-4 max-w-[500px]">
          <FeedSkeleton />
        </div>
      </div>
    </>
  );
}
