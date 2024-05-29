import React from "react";
import { twMerge } from "tailwind-merge";

export default function ErrorSection({
  children,
  errorMsg,
  className,
  noTitle,
}: {
  children?: React.ReactNode;
  errorMsg?: string;
  className?: string;
  noTitle?: boolean;
}) {
  const noUseTitle = noTitle ?? false;

  return (
    <div
      className={twMerge(
        "w-full min-h-[10vh] grid place-items-center p-4 text-center",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        {children
          ? children
          : !errorMsg && (
              <p className="text-sm">
                Hmm, an error has occurred and we are unable to load this
                section. Please try again later.
              </p>
            )}
        {errorMsg && (
          <p className="text-sm text-custom-grey-text">
            {!noUseTitle ? "ERROR: " : ""}
            {errorMsg ?? "Unknown Error"}
          </p>
        )}
      </div>
    </div>
  );
}
