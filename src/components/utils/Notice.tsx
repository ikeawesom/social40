import React from "react";
import { twMerge } from "tailwind-merge";

type NoticeType = {
  status: "info" | "success" | "warning" | "error";
  text: string;
  containerClassName?: string;
  textClassName?: string;
  noHeader?: boolean;
};
export default function Notice({
  status,
  text,
  containerClassName,
  textClassName,
  noHeader,
}: NoticeType) {
  return (
    <div
      className={twMerge(
        "w-full rounded-lg border-[1.2px] p-2",
        status === "info" && "bg-blue-50 border-blue-700",
        status === "success" && "bg-custom-light-green border-custom-green",
        status === "error" && "bg-custom-light-red border-custom-red",
        status === "warning" && "bg-custom-light-orange border-custom-orange",
        containerClassName
      )}
    >
      <p
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
        {text}
      </p>
    </div>
  );
}
