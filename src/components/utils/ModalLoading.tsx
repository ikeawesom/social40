import React from "react";
import LoadingIcon from "./LoadingIcon";
import { twMerge } from "tailwind-merge";

export default function ModalLoading({
  children,
  className,
  text,
}: {
  className?: string;
  text?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={twMerge("p-4 w-full grid place-items-center", className)}>
      <LoadingIcon height={30} width={30} />
      {children ?? (
        <p className="text-xs text-custom-grey-text mt-2">
          {text ?? "Working..."}
        </p>
      )}
    </div>
  );
}
