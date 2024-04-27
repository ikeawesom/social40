import HeaderBar from "@/src/components/navigation/HeaderBar";
import DefaultSkeleton from "@/src/components/utils/DefaultSkeleton";
import React from "react";

export default function loading() {
  return (
    <>
      <HeaderBar text="My Profile" />
      <div className="w-full grid place-items-center">
        <div className="flex flex-col w-full items-start justify-start gap-2 max-w-[500px]">
          <DefaultSkeleton className="h-[40vh]" />
          <DefaultSkeleton className="h-[30vh]" />
          <DefaultSkeleton />
        </div>
      </div>
    </>
  );
}
