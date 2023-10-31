import React from "react";
import LoadingIcon from "../utils/LoadingIcon";
import { twMerge } from "tailwind-merge";

export default function LoadingScreen({ className }: { className?: string }) {
  return (
    <div
      className={twMerge("h-[85vh] grid place-items-center m-0 p-0", className)}
    >
      <LoadingIcon />
    </div>
  );
}
