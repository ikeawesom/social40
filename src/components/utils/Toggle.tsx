"use client";

import React from "react";
import SecondaryButton from "./SecondaryButton";
import Image from "next/image";

export default function Toggle({
  disable,
  disabled,
  enable,
  forceDisable,
}: {
  disabled: boolean;
  enable: () => void;
  disable: () => void;
  forceDisable?: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-1 rounded-full shadow-inner border-[1px] border-custom-light-text">
      <SecondaryButton
        onClick={enable}
        disabled={forceDisable}
        activated={!disabled}
        className="py-1 px-1 flex items-center justify-center rounded-full border-0 shadow-none"
      >
        <Image
          alt="Yes"
          src="/icons/features/icon_tick.svg"
          width={20}
          height={20}
        />
      </SecondaryButton>
      <SecondaryButton
        disabled={forceDisable}
        onClick={disable}
        activated={disabled}
        className="py-1 px-1 flex items-center justify-center rounded-full border-0 shadow-none"
      >
        <Image
          alt="Yes"
          src="/icons/features/icon_cross_red.svg"
          width={20}
          height={20}
        />
      </SecondaryButton>
    </div>
  );
}
