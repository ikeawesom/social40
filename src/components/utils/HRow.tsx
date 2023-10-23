import React from "react";
import { twMerge } from "tailwind-merge";

export default function HRow({ className }: { className?: string }) {
  return (
    <div
      className={twMerge(
        "w-full h-[1.5px] bg-custom-light-text rounded-full my-1",
        className
      )}
    />
  );
}
