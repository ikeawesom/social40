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
    bookedIn?: boolean | undefined;
  };
  className?: string;
}) {
  const displayName = data.displayName;
  const memberID = data.memberID;
  const bookedIn = data.bookedIn;
  const dateJoined = data.dateJoined;

  return (
    <div
      className={twMerge(
        "w-full py-2 px-3 shadow-sm hover:bg-custom-light-text duration-300 flex items-center justify-between",
        className
      )}
    >
      <div className="flex flex-col items-start justify-center">
        <div className="flex items-center justify-start gap-1">
          <span
            className={`h-2 w-2 rounded-full ${
              bookedIn ? "bg-custom-green" : "bg-custom-orange"
            }`}
          />
          <h1 className="font-bold text-sm text-custom-dark-text">
            {displayName}
          </h1>
        </div>
        <p className="text-xs text-custom-grey-text">
          {memberID.length > MAX_LENGTH
            ? memberID.substring(0, MAX_LENGTH - 3) + "..."
            : memberID}
        </p>
        <p className="text-xs text-custom-grey-text">Joined on: {dateJoined}</p>
      </div>
    </div>
  );
}
