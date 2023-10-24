import React from "react";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import Image from "next/image";

type GroupItemType = {
  displayName: string;
  memberID: string;
  className?: string;
};

const MAX_LENGTH = 20;

export default function RequestedUser({
  displayName,
  memberID,
  className,
}: GroupItemType) {
  return (
    <div
      className={twMerge(
        "w-full bg-white rounded-lg py-2 px-3 shadow-sm hover:brightness-95 duration-300 flex items-center justify-between",
        className
      )}
    >
      <div className="flex flex-col items-start justify-center">
        <h1 className="font-medium text-sm">{displayName}</h1>
        <p className="text-xs text-custom-grey-text">
          {memberID.length > MAX_LENGTH
            ? memberID.substring(0, MAX_LENGTH - 3) + "..."
            : memberID}
        </p>
      </div>
      <div className="flex items-center justify-center gap-1">
        <PrimaryButton className="p-1 bg-custom-light-green border-[1px] border-custom-green">
          <Image
            src="/icons/icon_tick.svg"
            alt="Accept"
            width={20}
            height={20}
          />
        </PrimaryButton>
        <SecondaryButton className="p-1 bg-custom-light-red border-[1px] border-custom-red">
          <Image
            src="/icons/icon_cross.svg"
            width={20}
            height={20}
            alt="Reject"
          />
        </SecondaryButton>
      </div>
    </div>
  );
}
