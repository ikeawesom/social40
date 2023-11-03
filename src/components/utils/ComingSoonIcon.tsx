import React from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export default function ComingSoonIcon({
  width,
  height,
  small,
  className,
}: {
  width?: number;
  height?: number;
  small?: boolean;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "flex flex-col items-center justify-center gap-4",
        className
      )}
    >
      <Image
        alt="Coming Soon"
        src="/icons/icon_fire.svg"
        width={width ? width : 150}
        height={height ? height : 150}
      />
      <h1
        className={twMerge(
          "text-custom-dark-text font-bold",
          small ? "text-lg" : "text-2xl"
        )}
      >
        Coming soon!
      </h1>
    </div>
  );
}
