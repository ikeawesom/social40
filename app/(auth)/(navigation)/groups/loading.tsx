import React from "react";
import DefaultSkeleton from "@/src/components/utils/DefaultSkeleton";
import HeaderBar from "@/src/components/navigation/HeaderBar";

export default function loading() {
  return (
    <>
      <HeaderBar text="Groups" />
      <div className="w-full grid place-items-center">
        <div className="flex flex-col w-full items-start justify-start gap-2 max-w-[500px]">
          <DefaultSkeleton className="h-[40px] w-[100px]" />
          <DefaultSkeleton className="h-[40px] w-[200px]" />
          <DefaultSkeleton className="h-[50px]" />
          <DefaultSkeleton className="h-[50px]" />
          <DefaultSkeleton className="h-[50px]" />
          <DefaultSkeleton className="h-[50px]" />
        </div>
      </div>
    </>
  );
}
