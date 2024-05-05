import React from "react";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

type NoticeType = {
  status: "info" | "success" | "warning" | "error";
  children?: React.ReactNode;
  containerClassName?: string;
  textClassName?: string;
  noHeader?: boolean;
  close?: () => void;
};
export default function Notice({
  status,
  children,
  containerClassName,
  textClassName,
  noHeader,
  close,
}: NoticeType) {
  return (
    <div
      className={twMerge(
        "w-full rounded-lg border-[1.2px] p-2 relative",
        status === "info" && "bg-blue-50 border-blue-700/30",
        status === "success" && "bg-custom-light-green border-custom-green/30",
        status === "error" && "bg-custom-light-red border-custom-red/30",
        status === "warning" &&
          "bg-custom-light-orange border-custom-orange/30",
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
        {children ?? "This is a notice card."}
      </p>
      {close && (
        <Image
          src="/icons/icon_close.svg"
          alt="Close"
          width={10}
          height={10}
          onClick={close}
          className="absolute top-3 right-3 cursor-pointer hover:opacity-70"
        />
      )}
    </div>
  );
}
