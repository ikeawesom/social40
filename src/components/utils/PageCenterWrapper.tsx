import React from "react";
import { twMerge } from "tailwind-merge";

export default function PageCenterWrapper({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="grid place-items-center w-full">
      <div className={twMerge("max-w-[500px] w-full", className)}>
        {children}
      </div>
    </div>
  );
}
