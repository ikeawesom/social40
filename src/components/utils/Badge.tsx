import React from "react";
import { twMerge } from "tailwind-merge";

export default function Badge({
  children,
  className,
  backgroundColor,
  primaryColor,
}: {
  className?: string;
  children?: React.ReactNode;
  primaryColor?: string;
  backgroundColor?: string;
}) {
  return (
    <div
      className={twMerge(
        "px-2 py-1 border-[1px] rounded-md w-fit",
        primaryColor ?? "border-blue-300",
        backgroundColor ?? "bg-blue-50",
        className
      )}
    >
      <p className={twMerge("text-xs", primaryColor ?? "text-blue-300")}>
        {children ?? "TEXT"}
      </p>
    </div>
  );
}
