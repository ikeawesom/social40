import React from "react";
import { twMerge } from "tailwind-merge";

export default function InnerContainer({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "relative w-full flex-col flex items-center justify-start overflow-y-scroll rounded-lg shadow-inner",
        className
      )}
    >
      {children}
    </div>
  );
}
