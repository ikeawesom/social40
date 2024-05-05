import React from "react";
import { twMerge } from "tailwind-merge";

type NoticeType = {
  status: "info" | "success" | "warning" | "error";
  children?: React.ReactNode;
  containerClassName?: string;
  textClassName?: string;
  noHeader?: boolean;
};
export default function Notice({
  status,
  children,
  containerClassName,
  textClassName,
  noHeader,
}: NoticeType) {
  return (
    <div
      className={twMerge(
        "w-full rounded-lg border-[1.2px] p-2 px-3 relative",
        status === "info" && "bg-blue-50 border-blue-700/30",
        status === "success" && "bg-custom-light-green border-custom-green/30",
        status === "error" && "bg-custom-light-red border-custom-red/30",
        status === "warning" &&
          "bg-custom-light-orange/50 border-custom-orange/30",
        containerClassName
      )}
    >
      <div
        className={twMerge(
          status === "info" && "text-blue-700",
          status === "success" && "text-custom-green",
          status === "error" && "text-custom-red",
          status === "warning" && "text-custom-orange",
          textClassName,
          "text-sm"
        )}
      >
        {!noHeader && (
          <span className="font-semibold">[{status.toUpperCase()}]</span>
        )}{" "}
        {children ?? "This is a notice card."}
      </div>
    </div>
  );
}
