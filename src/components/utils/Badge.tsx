import React from "react";
import { twMerge } from "tailwind-merge";

export default function Badge({
  children,
  className,
  backgroundColor,
  borderColor,
  textColor,
}: {
  className?: string;
  children?: React.ReactNode;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
}) {
  return (
    <div
      className={twMerge(
        "px-2 py-1 border-[1px] rounded-md w-fit",
        borderColor ?? "border-blue-300",
        backgroundColor ?? "bg-blue-50",
        className
      )}
    >
      <p className={twMerge("text-xs", textColor ?? "text-blue-300")}>
        {children ?? "TEXT"}
      </p>
    </div>
  );
}
