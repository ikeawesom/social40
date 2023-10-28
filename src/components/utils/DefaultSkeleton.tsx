import React from "react";
import DefaultCard from "../DefaultCard";
import { twMerge } from "tailwind-merge";

export default function DefaultSkeleton({ className }: { className?: string }) {
  return (
    <DefaultCard
      className={twMerge(
        "w-full animate-pulse bg-gray-200 h-[20vh]",
        className
      )}
    />
  );
}
