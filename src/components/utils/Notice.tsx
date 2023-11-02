import React from "react";
import { twMerge } from "tailwind-merge";

type NoticeType = {
  status: "info" | "success" | "warning" | "error";
  text: string;
  containerClassName?: string;
  textClassName?: string;
};
export default function Notice({
  status,
  text,
  containerClassName,
  textClassName,
}: NoticeType) {
  return (
    <div
      className={twMerge(
        "w-full rounded-lg border-[1.5px]",
        status === "info" && "bg-blue-100 border-blue-800",
        status === "success" && "bg-custom-light-green border-custom-green",
        status === "error" && "bg-custom-light-red border-custom-red",
        status === "warning" && "bg-custom-light-orange border-custom-orange",
        containerClassName
      )}
    >
      <p
        className={twMerge(
          status === "info" && "text-blue-800",
          status === "success" && "text-custom-green",
          status === "error" && "text-custom-red",
          status === "warning" && "text-custom-orange",
          textClassName
        )}
      >
        {text}
      </p>
    </div>
  );
}
