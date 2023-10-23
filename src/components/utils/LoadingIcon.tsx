import React from "react";
import Image from "next/image";

type LoadingType = {
  width?: number;
  height?: number;
};

export default function LoadingIcon({ height, width }: LoadingType) {
  return (
    <div className="animate-spin">
      <Image
        src="/icons/icon_spinner.svg"
        width={height ? height : 100}
        height={width ? width : 100}
        alt="Loading..."
      />
    </div>
  );
}
