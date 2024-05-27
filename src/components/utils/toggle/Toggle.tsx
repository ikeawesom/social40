"use client";

import React from "react";
import SecondaryButton from "../SecondaryButton";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export default function Toggle({
  disable,
  disabled,
  enable,
  forceDisable,
  className,
  buttonClassName,
}: {
  disabled: boolean;
  enable: () => void;
  disable: () => void;
  forceDisable?: boolean;
  className?: string;
  buttonClassName?: string;
}) {
  return (
    <div
      className={twMerge(
        "flex items-center justify-center gap-1 rounded-full shadow-inner border-[1px] border-custom-light-text",
        className
      )}
    >
      <SecondaryButton
        onClick={enable}
        disabled={forceDisable}
        activated={!disabled}
        className={twMerge(
          "py-1 px-1 flex items-center justify-center rounded-full border-[1px] shadow-none",
          buttonClassName
        )}
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
        className={twMerge(
          "py-1 px-1 flex items-center justify-center rounded-full border-[1px] shadow-none",
          buttonClassName
        )}
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
