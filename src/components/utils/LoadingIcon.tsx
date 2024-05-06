import React from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

type LoadingType = {
  width?: number;
  height?: number;
  className?: string;
};

export default function LoadingIcon({ height, width, className }: LoadingType) {
  return (
    <Image
      src="/icons/icon_spinner.svg"
      width={height ? height : 100}
      height={width ? width : 100}
      alt="Loading..."
      className={twMerge("animate-spin", className)}
    />
  );
}

export function LoadingIconBright({ height, width, className }: LoadingType) {
  return (
    <Image
      src="/icons/icon_spinner_bright.svg"
      width={height ? height : 100}
      height={width ? width : 100}
      alt="Loading..."
      className={twMerge("animate-spin", className)}
    />
  );
}
