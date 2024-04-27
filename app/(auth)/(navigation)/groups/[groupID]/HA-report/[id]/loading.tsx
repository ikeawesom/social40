import React from "react";
import DefaultSkeleton from "@/src/components/utils/DefaultSkeleton";
import HeaderBar from "@/src/components/navigation/HeaderBar";

export default function loading() {
  return (
    <>
      <HeaderBar text="HA Reports" back />
      <div className="w-full grid place-items-center">
        <div className="flex flex-col w-full items-center justify-start gap-2 max-w-[500px]">
          <div className="flex flex-col items-center justify-center gap-1 mt-3 w-full">
            <DefaultSkeleton className="h-[20px] max-w-[300px] w-full" />
            <DefaultSkeleton className="h-[5px] max-w-[200px] w-full" />
            <DefaultSkeleton className="h-[5px] max-w-[200px] w-full" />
            <div className="flex items-center justify-center gap-x-3 gap-y-2 w-full max-[400px]:flex-wrap mt-2">
              <DefaultSkeleton className="h-[8px] max-w-[300px] w-full" />
              <DefaultSkeleton className="h-[8px] max-w-[300px] w-full" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-3 w-full">
            <DefaultSkeleton className="h-[50px] max-w-[150px]" />
            <DefaultSkeleton className="h-[50px] max-w-[150px]" />
          </div>
          <DefaultSkeleton className="h-[7vh]" />
          <DefaultSkeleton className="h-[7vh]" />
          <DefaultSkeleton className="h-[7vh]" />
          <DefaultSkeleton className="h-[7vh]" />
          <DefaultSkeleton className="h-[7vh]" />
          <DefaultSkeleton className="h-[7vh]" />
          <DefaultSkeleton className="h-[7vh]" />
          <DefaultSkeleton className="h-[7vh]" />
          <DefaultSkeleton className="h-[7vh]" />
          <DefaultSkeleton className="h-[3vh]" />
        </div>
      </div>
    </>
  );
}
