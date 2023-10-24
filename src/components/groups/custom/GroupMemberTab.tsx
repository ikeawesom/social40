import React from "react";
import { twMerge } from "tailwind-merge";
import { MAX_LENGTH } from "./requests/RequestedUser";

export default function GroupMemberTab({
  data,
  className,
}: {
  data: {
    dateJoined: string;
    memberID: string;
    role: string;
    displayName?: string | undefined;
  };
  className?: string;
}) {
  const displayName = data.displayName;
  const memberID = data.memberID;

  return (
    <div
      className={twMerge(
        "w-full py-2 px-3 shadow-sm hover:bg-custom-light-text duration-300 flex items-center justify-between",
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
    </div>
  );
}
