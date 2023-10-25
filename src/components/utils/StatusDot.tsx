import React from "react";
import { twMerge } from "tailwind-merge";

export default function StatusDot({
  status,
  className,
}: {
  status: boolean;
  className?: string;
}) {
  return (
    <span
      className={twMerge(
        `h-2 w-2 rounded-full ${
          status ? "bg-custom-green" : "bg-custom-orange"
        }`,
        className
      )}
    />
  );
}
