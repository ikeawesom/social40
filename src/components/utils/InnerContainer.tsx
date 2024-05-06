import React from "react";
import { twMerge } from "tailwind-merge";

export default function InnerContainer({
  children,
  className,
  noBorder,
}: {
  children?: React.ReactNode;
  className?: string;
  noBorder?: boolean;
}) {
  return (
    <div
      className={twMerge(
        "relative w-full flex-col flex items-center justify-start overflow-y-scroll rounded-lg shadow-inner",
        !noBorder && "border-[1px] border-custom-light-text",
        className
      )}
    >
      {children}
    </div>
  );
}
