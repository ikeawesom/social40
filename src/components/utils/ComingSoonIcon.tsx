import React from "react";
import Image from "next/image";

export default function ComingSoonIcon({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Image
        alt="Coming Soon"
        src="/icons/icon_fire.svg"
        width={width ? width : 150}
        height={height ? height : 150}
      />
      <h1 className="text-custom-dark-text font-bold text-2xl">Coming soon!</h1>
    </div>
  );
}
