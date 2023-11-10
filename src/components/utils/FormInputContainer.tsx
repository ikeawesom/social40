import React from "react";
import { twMerge } from "tailwind-merge";

export default function FormInputContainer({
  children,
  className,
  inputName,
  labelText,
}: {
  children: React.ReactNode;
  className?: string;
  inputName: string;
  labelText: string;
}) {
  return (
    <div
      className={twMerge(
        "w-full flex flex-col items-start justify-start gap-1",
        className
      )}
    >
      <label className="text-xs text-custom-grey-text" htmlFor={inputName}>
        {labelText}
      </label>
      {children}
    </div>
  );
}
