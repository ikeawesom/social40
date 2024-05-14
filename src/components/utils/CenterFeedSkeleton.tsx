import React from "react";
import DefaultSkeleton from "./DefaultSkeleton";
import { twMerge } from "tailwind-merge";

export default function CenterFeedSkeleton({
  height,
  header,
}: {
  height?: string;
  header?: boolean;
}) {
  return (
    <div className="w-full grid place-items-center">
      <div className="flex flex-col w-full items-center justify-start gap-2 max-w-[500px]">
        {header && <DefaultSkeleton className="h-[7vh]" />}
        <DefaultSkeleton className={twMerge(height ?? "h-[10vh]")} />
        <DefaultSkeleton className={twMerge(height ?? "h-[10vh]")} />
        <DefaultSkeleton className={twMerge(height ?? "h-[10vh]")} />
        <DefaultSkeleton className={twMerge(height ?? "h-[10vh]")} />
        <DefaultSkeleton className={twMerge(height ?? "h-[10vh]")} />
        <DefaultSkeleton className={twMerge(height ?? "h-[10vh]")} />
        <DefaultSkeleton className={twMerge(height ?? "h-[10vh]")} />
        <DefaultSkeleton className={twMerge(height ?? "h-[10vh]")} />
        <DefaultSkeleton className={twMerge(height ?? "h-[10vh]")} />
        <DefaultSkeleton className={twMerge(height ?? "h-[10vh]")} />
        <DefaultSkeleton className={twMerge(height ?? "h-[10vh]")} />
        <DefaultSkeleton className={twMerge(height ?? "h-[10vh]")} />
        <DefaultSkeleton className={twMerge(height ?? "h-[10vh]")} />
      </div>
    </div>
  );
}
