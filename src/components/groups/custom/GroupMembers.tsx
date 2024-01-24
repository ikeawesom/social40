"use client";
import React, { useState } from "react";
import InnerContainer from "../../utils/InnerContainer";
import GroupMemberTab from "./GroupMemberTab";
import { GROUP_MEMBERS_SCHEMA } from "@/src/utils/schemas/groups";
import StatusDot from "../../utils/StatusDot";
import useQueryObj from "@/src/hooks/useQueryObj";
import QueryInput from "../../utils/QueryInput";
import { twMerge } from "tailwind-merge";

export type GroupDetailsType = {
  [memberID: string]: GROUP_MEMBERS_SCHEMA;
};

export default function GroupMembers({
  membersList,
  groupID,
  curMember,
}: {
  membersList: GroupDetailsType;
  groupID: string;
  curMember: GROUP_MEMBERS_SCHEMA;
}) {
  const [show, setShow] = useState(false);
  const [online, setOnline] = useState(0);
  const { itemList, search, handleSearch } = useQueryObj({ obj: membersList });

  const addOnline = () => setOnline((online) => online + 1);
  return (
    <div className="w-full flex flex-col items-start justify-start gap-2 max-h-[80vh]">
      <h1
        onClick={() => setShow(!show)}
        className={twMerge(
          "text-start cursor-pointer underline text-sm duration-150",
          !show ? "text-custom-grey-text" : "text-custom-primary"
        )}
      >
        {show ? "Hide Breakdown" : "View Breakdown"}
      </h1>
      {show && (
        <>
          <QueryInput
            placeholder="Search for Member ID"
            handleSearch={handleSearch}
            search={search}
          />
          <div className="flex items-center justify-end gap-1 w-fit">
            <p className="text-xs text-custom-grey-text">{online} in camp</p>
            <StatusDot className="w-1 h-1" status />
          </div>
          <InnerContainer className="max-h-[90vh]">
            {Object.keys(itemList).map((item) => (
              <GroupMemberTab
                addOnline={addOnline}
                curMember={curMember}
                groupID={groupID}
                key={item}
                data={itemList[item]}
              />
            ))}
          </InnerContainer>
        </>
      )}
    </div>
  );
}
