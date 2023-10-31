import React from "react";
import Image from "next/image";

type LoadingType = {
  width?: number;
  height?: number;
};

export default function LoadingIcon({ height, width }: LoadingType) {
  return (
    <Image
      src="/icons/icon_spinner.svg"
      width={height ? height : 100}
      height={width ? width : 100}
      alt="Loading..."
      className="animate-spin"
    />
  );
}

export function LoadingIconBright({ height, width }: LoadingType) {
  return (
    <Image
      src="/icons/icon_spinner_bright.svg"
      width={height ? height : 100}
      height={width ? width : 100}
      alt="Loading..."
      className="animate-spin"
    />
  );
}
