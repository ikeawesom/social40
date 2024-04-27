import React from "react";
import DefaultSkeleton from "@/src/components/utils/DefaultSkeleton";
import HeaderBar from "@/src/components/navigation/HeaderBar";

export default function loading() {
  return (
    <>
      <HeaderBar text="View Activity" back />
      <div className="w-full grid place-items-center">
        <div className="flex flex-col w-full items-center justify-start gap-4 max-w-[500px]">
          <DefaultSkeleton className="h-[20vh]" />
          <DefaultSkeleton className="h-[40vh]" />
          <DefaultSkeleton className="h-[40px]" />
        </div>
      </div>
    </>
  );
}
