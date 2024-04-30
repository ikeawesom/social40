import React from "react";
import { twMerge } from "tailwind-merge";

export default function BookedStatus({ status }: { status: boolean }) {
  const bg = status ? "bg-custom-green" : "bg-custom-orange";
  const color = status ? "text-custom-green" : "text-custom-orange";
  const border = status ? "border-custom-green" : "border-custom-orange";
  const text = status ? "IN CAMP" : "BOOKED OUT";

  return (
    <div
      className={twMerge(
        "h-[10px] w-[10px] rounded-full",
        bg
        // color,
        // border
      )}
    />
  );
}
