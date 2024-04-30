import React from "react";
import DefaultSkeleton from "@/src/components/utils/DefaultSkeleton";
import HeaderBar from "@/src/components/navigation/HeaderBar";

export default function loading() {
  return (
    <>
      <HeaderBar text="COS Plan for ..." back />
      <div className="w-full grid place-items-center">
        <div className="flex flex-col w-full items-start justify-start gap-2 max-w-[500px]">
          <DefaultSkeleton className="h-[30px] max-w-[150px]" />
          <DefaultSkeleton className="h-[14vh] mb-2" />
          <DefaultSkeleton className="h-[30px] max-w-[150px]" />
          <DefaultSkeleton className="h-[15px]" />
          <DefaultSkeleton className="h-[15px]" />
          <DefaultSkeleton className="h-[15px]" />
        </div>
      </div>
    </>
  );
}
