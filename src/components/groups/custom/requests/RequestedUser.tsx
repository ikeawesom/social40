import React from "react";
import { twMerge } from "tailwind-merge";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import { WAITLIST_SCHEMA } from "@/src/utils/schemas/waitlist";
import { MAX_LENGTH } from "@/src/utils/settings";

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
        "w-full rounded-lg py-2 px-3 shadow-sm hover:bg-custom-light-text duration-150 gap-1 flex flex-col items-start justify-center",
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
      <div className="flex items-center justify-between gap-4 duration-150 w-full">
        <PrimaryButton
          className="py-1 border-[1px] border-transparent"
          onClick={() => accept(memberID, groupID, displayName, password)}
        >
          Accept
        </PrimaryButton>
        <SecondaryButton
          className="border-custom-red text-custom-red py-1"
          onClick={() => reject(groupID, memberID)}
        >
          Reject
        </SecondaryButton>
      </div>
    </div>
  );
}
