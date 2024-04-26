import React from "react";
import LoadingIcon from "../utils/LoadingIcon";
import { twMerge } from "tailwind-merge";

export default function LoadingScreen({
  className,
  text,
}: {
  className?: string;
  text?: string;
}) {
  return (
    <div
      className={twMerge("h-[85vh] grid place-items-center m-0 p-0", className)}
    >
      <div className="flex items-center justify-center gap-4 flex-col p-6">
        <LoadingIcon />
        {text && (
          <h1 className="text-center text-sm text-custom-dark-text">{text}</h1>
        )}
      </div>
    </div>
  );
}
