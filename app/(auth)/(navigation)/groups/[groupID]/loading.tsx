import React from "react";
import DefaultSkeleton from "@/src/components/utils/DefaultSkeleton";
import HeaderBar from "@/src/components/navigation/HeaderBar";

export default function loading() {
  return (
    <>
      <HeaderBar text="Loading..." back />
      <div className="w-full grid place-items-center">
        <div className="flex flex-col w-full items-center justify-start gap-4 max-w-[500px]">
          <div className="flex flex-col items-center justify-center gap-1">
            <DefaultSkeleton className="h-[2px] w-[100px]" />
            <DefaultSkeleton className="h-[10px] w-[200px]" />
            <DefaultSkeleton className="h-[5px] w-[300px]" />
          </div>
          <DefaultSkeleton className="h-[40vh]" />
          <DefaultSkeleton className="h-[25vh]" />
          <DefaultSkeleton className="h-[30vh]" />
          <DefaultSkeleton className="h-[10vh]" />
        </div>
      </div>
    </>
  );
}
