import React from "react";
import PrimaryButton from "../PrimaryButton";
import SecondaryButton from "../SecondaryButton";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export default function ModalNext({
  finalNum,
  pageNum,
  startNum,
  primaryDisabled,
  backDisabled,
  nextDisabled,
  toggleNext,
  toggleBack,
  primaryText,
  className,
}: {
  backDisabled?: boolean;
  nextDisabled?: boolean;
  primaryDisabled?: boolean;
  toggleNext: () => void;
  toggleBack: () => void;
  pageNum: number;
  startNum?: number;
  finalNum: number;
  primaryText?: string;
  className?: string;
}) {
  const starting = startNum ?? 0;
  const isStart = starting === pageNum;
  const isEnd = finalNum === pageNum;

  return (
    <div
      className={twMerge(
        "w-full flex items-center justify-center gap-2",
        className
      )}
    >
      <SecondaryButton
        disabled={isStart || backDisabled}
        onClick={toggleBack}
        className="flex items-center justify-center py-2"
      >
        <Image
          alt=""
          src="/icons/icon_arrow-down.svg"
          className="rotate-90 translate-y-[0.1px] translate-x-[2px]"
          width={25}
          height={25}
        />
        Back
      </SecondaryButton>
      {!isEnd ? (
        <SecondaryButton
          className="flex items-center justify-center py-2"
          disabled={nextDisabled}
          onClick={toggleNext}
        >
          Next
          <Image
            alt=""
            src="/icons/icon_arrow-down.svg"
            className="-rotate-90 translate-y-[0.1px] -translate-x-[2px]"
            width={25}
            height={25}
          />
        </SecondaryButton>
      ) : (
        <PrimaryButton
          disabled={primaryDisabled}
          type="submit"
          className="w-full self-stretch"
        >
          {primaryText ?? "Submit here"}
        </PrimaryButton>
      )}
    </div>
  );
}
