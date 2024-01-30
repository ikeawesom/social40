import { TimestampToDateString } from "@/src/utils/getCurrentDate";
import { GROUP_MEMBERS_SCHEMA } from "@/src/utils/schemas/groups";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function SelectMemberTab({
  setMembers,
  memberData,
  addMembers,
}: {
  setMembers: React.Dispatch<
    React.SetStateAction<{
      check: boolean;
      members: string[];
    }>
  >;
  memberData: GROUP_MEMBERS_SCHEMA;
  addMembers: { check: boolean; members: string[] };
}) {
  let curMembers = addMembers.members;
  return (
    <div
      onClick={() => {
        if (curMembers.includes(memberData.memberID)) {
          // user wants to deselect
          curMembers.splice(curMembers.indexOf(memberData.memberID), 1);
        } else {
          // user wants to select
          curMembers.push(memberData.memberID);
        }
        setMembers({ ...addMembers, members: curMembers });
      }}
      className={twMerge(
        "w-full py-2 px-3 flex items-start justify-center flex-col duration-150 cursor-pointer",
        curMembers.includes(memberData.memberID)
          ? "bg-custom-light-orange hover:brightness-90"
          : "hover:bg-custom-light-text"
      )}
    >
      <h1 className="text-custom-dark-text font-semibold text-sm">
        {memberData.displayName}
      </h1>
      <h4 className="text-custom-grey-text text-xs">{memberData.memberID}</h4>
      <h4 className="text-custom-grey-text text-xs">
        Date Joined: {TimestampToDateString(memberData.dateJoined)}
      </h4>
    </div>
  );
}
