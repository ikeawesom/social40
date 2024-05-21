import React from "react";
import DefaultCard from "../DefaultCard";
import { twMerge } from "tailwind-merge";

export default function DefaultSkeleton({ className }: { className?: string }) {
  return (
    <DefaultCard
      className={twMerge(
        "w-full bg-gray-300 h-[20vh] relative overflow-hidden fade-in-bottom",
        className
      )}
    >
      <div className="shimmer" />
    </DefaultCard>
  );
}
