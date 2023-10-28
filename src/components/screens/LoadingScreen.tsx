import React from "react";
import LoadingIcon from "../utils/LoadingIcon";
import { twMerge } from "tailwind-merge";

export default function LoadingScreen({ className }: { className?: string }) {
  return (
    <div className={twMerge("h-screen grid place-items-center", className)}>
      <LoadingIcon />
    </div>
  );
}
