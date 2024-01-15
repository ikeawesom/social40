import React from "react";
import { twMerge } from "tailwind-merge";

export default function ActivityStatusTab({ active }: { active: boolean }) {
  return (
    <div
      className={twMerge(
        "px-2 py-1 rounded-lg text-sm",
        active
          ? "bg-custom-light-green text-custom-green"
          : "bg-custom-light-red text-custom-red"
      )}
    >
      {active ? "UPCOMING" : "FINISHED"}
    </div>
  );
}
