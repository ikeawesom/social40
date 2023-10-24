import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import Image from "next/image";
import { WAITLIST_SCHEMA } from "@/src/utils/schemas/waitlist";

type GroupItemType = {
  className?: string;
  data: WAITLIST_SCHEMA;
  accept: (
    memberID: string,
    groupID: string,
    displayName: string,
    password: string | undefined
  ) => void;
  reject: (groupID: string, memberID: string) => void;
  groupID: string;
};

const MAX_LENGTH = 20;

export default function RequestedUser({
  className,
  data,
  groupID,
  accept,
  reject,
}: GroupItemType) {
  const { displayName, memberID, password } = data;

  return (
    <div
      className={twMerge(
        "w-full rounded-lg py-2 px-3 shadow-sm hover:bg-custom-light-text duration-300 flex items-center justify-between",
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
      <div className="flex items-center justify-center gap-1 duration-200">
        <PrimaryButton
          className="p-1 bg-custom-light-green border-[1px] border-custom-green"
          onClick={() => accept(memberID, groupID, displayName, password)}
        >
          <Image
            src="/icons/icon_tick.svg"
            alt="Accept"
            width={20}
            height={20}
          />
        </PrimaryButton>
        <SecondaryButton
          className="p-1 bg-custom-light-red border-[1px] border-custom-red"
          onClick={() => reject(groupID, memberID)}
        >
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