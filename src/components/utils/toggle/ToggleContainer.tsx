import React from "react";
import { twMerge } from "tailwind-merge";
import Toggle from "./Toggle";

export default function ToggleContainer({
  flex,
  disable,
  enable,
  text,
  className,
  disabled,
  forceDisable,
  textClassName,
  buttonClassName,
  toggleClassName,
}: {
  flex?: boolean;
  className?: string;
  text: string;
  textClassName?: string;
  toggleClassName?: string;
  buttonClassName?: string;
  enable: () => void;
  disable: () => void;
  disabled: boolean;
  forceDisable?: boolean;
}) {
  return (
    <div
      className={twMerge(
        flex && "flex items-center justify-start gap-2 w-full",
        className
      )}
    >
      <p className={twMerge("text-sm text-custom-dark-text", textClassName)}>
        {text}
      </p>
      <Toggle
        className={twMerge(
          !flex ? "w-fit mt-2 border-[1px]" : "shadow-none border-none",
          toggleClassName
        )}
        disabled={disabled}
        disable={disable}
        enable={enable}
        forceDisable={forceDisable}
        buttonClassName={buttonClassName}
      />
    </div>
  );
}
