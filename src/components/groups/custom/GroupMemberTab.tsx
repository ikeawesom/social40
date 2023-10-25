import React from "react";
import { twMerge } from "tailwind-merge";
import { MAX_LENGTH } from "./requests/RequestedUser";
import { useMemberID } from "@/src/hooks/useMemberID";
import { useRouter } from "next/navigation";
import StatusDot from "../../utils/StatusDot";

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
  const { memberID } = useMemberID();
  const router = useRouter();
  const displayName = data.displayName as string;
  const groupMemberID = data.memberID;
  const bookedIn = data.bookedIn as boolean;
  const dateJoined = data.dateJoined;
  const role = data.role;

  if (data)
    return (
      <div
        onClick={() => router.push(`/members/${groupMemberID}`)}
        className={twMerge(
          "w-full py-2 px-3 shadow-sm duration-300 flex items-center justify-between cursor-pointer",
          memberID === groupMemberID
            ? "bg-custom-light-orange hover:brightness-95"
            : "hover:bg-custom-light-text",
          className
        )}
      >
        <div className="flex flex-col items-start justify-center">
          <div className="flex items-center justify-start gap-1">
            <h1 className="font-bold text-sm text-custom-dark-text">
              {displayName}
            </h1>
            {role === "owner" && (
              <p className="text-xs text-custom-green">(owner)</p>
            )}
            <StatusDot status={bookedIn} />
          </div>
          <p className="text-xs text-custom-grey-text">
            {groupMemberID.length > MAX_LENGTH
              ? groupMemberID.substring(0, MAX_LENGTH - 3) + "..."
              : groupMemberID}
          </p>
          <p className="text-xs text-custom-grey-text">
            Joined on: {dateJoined}
          </p>
        </div>
      </div>
    );
}
