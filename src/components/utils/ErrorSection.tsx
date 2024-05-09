import React from "react";
import { twMerge } from "tailwind-merge";

export default function ErrorSection({
  children,
  errorMsg,
  className,
}: {
  children?: React.ReactNode;
  errorMsg?: string;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "w-full h-[10vh] grid place-items-center p-4 text-center",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-sm">
          {children ??
            "Hmm, an error has occurred and we are unable to load this section. Please try again later."}
        </p>
        {errorMsg && (
          <p className="text-sm text-custom-grey-text">
            ERROR: {errorMsg ?? "Unknown Error"}
          </p>
        )}
      </div>
    </div>
  );
}
