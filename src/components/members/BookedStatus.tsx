import React from "react";
import { twMerge } from "tailwind-merge";

export default function BookedStatus({ status }: { status: boolean }) {
  const bg = status ? "bg-custom-light-green" : "bg-custom-light-orange";
  const color = status ? "text-custom-green" : "text-custom-orange";
  const border = status ? "border-custom-green" : "border-custom-orange";
  const text = status ? "IN CAMP" : "BOOKED OUT";

  return (
    <div
      className={twMerge(
        "px-2 py-1 border-[1px] rounded-lg",
        bg,
        color,
        border
      )}
    >
      <h4 className={twMerge("text-xs", color)}>{text}</h4>
    </div>
  );
}
