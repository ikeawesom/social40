import React from "react";
import Image from "next/image";

export default function LoadingIcon() {
  return (
    <div className="animate-spin">
      <Image
        src="/icons/icon_spinner.svg"
        width={100}
        height={100}
        alt="Loading..."
      />
    </div>
  );
}
