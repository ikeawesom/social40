"use client";
import React, { useState } from "react";
import DefaultCard from "../../DefaultCard";
import InnerContainer from "../../utils/InnerContainer";
import GroupMemberTab from "./GroupMemberTab";
import { GROUP_MEMBERS_SCHEMA } from "@/src/utils/schemas/groups";
import StatusDot from "../../utils/StatusDot";
import useQueryObj from "@/src/hooks/useQueryObj";
import QueryInput from "../../utils/QueryInput";

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
  const [online, setOnline] = useState(0);
  const { itemList, search, handleSearch } = useQueryObj({ obj: membersList });

  const length = Object.keys(itemList).length;

  const addOnline = () => setOnline((online) => online + 1);
  return (
    <DefaultCard className="w-full flex flex-col items-start justify-start gap-2 max-h-[80vh]">
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-custom-dark-text font-semibold text-start">
            Members ( {length} )
          </h1>
          <div className="flex items-center justify-end gap-1">
            <p className="text-xs text-custom-grey-text">{online} in camp</p>
            <StatusDot className="w-1 h-1" status />
          </div>
        </div>
      </div>
      <QueryInput
        placeholder="Search for Member ID"
        handleSearch={handleSearch}
        search={search}
      />
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
    </DefaultCard>
  );
}
