import React from "react";
import { twMerge } from "tailwind-merge";

export default function Badge({
  children,
  className,
  backgroundColor,
  borderColor,
  textColor,
  noBorder,
}: {
  className?: string;
  children?: React.ReactNode;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  noBorder?: boolean;
}) {
  return (
    <div
      className={twMerge(
        "px-2 py-1 rounded-md w-fit",
        !noBorder && "border-[1px]",
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
