import React from "react";
import Image from "next/image";
import HRow from "./HRow";
import { twMerge } from "tailwind-merge";

export default function ModalHeader({
  close,
  className,
  heading,
}: {
  className?: string;
  heading?: string;
  close?: () => void;
}) {
  return (
    <>
      <div
        className={twMerge(
          "flex items-center justify-between w-full",
          className
        )}
      >
        <h1 className="text-custom-dark-text font-semibold text-base">
          {heading ?? "Modal Heading"}
        </h1>
        {close && (
          <button onClick={close} className="hover:opacity-75 duration-150">
            <Image
              src="/icons/icon_close.svg"
              alt="Close"
              width={15}
              height={15}
            />
          </button>
        )}
      </div>
      <HRow className="mb-2" />
    </>
  );
}
