import React from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export default function ComingSoonIcon({
  width,
  height,
  small,
}: {
  width?: number;
  height?: number;
  small?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
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
