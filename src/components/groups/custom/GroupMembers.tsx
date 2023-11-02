import React from "react";
import DefaultCard from "../../DefaultCard";
import HRow from "../../utils/HRow";
import InnerContainer from "../../utils/InnerContainer";
import GroupMemberTab from "./GroupMemberTab";
import { GROUP_MEMBERS_SCHEMA } from "@/src/utils/schemas/groups";

export type GroupDetailsType = {
  [memberID: string]: GROUP_MEMBERS_SCHEMA;
};

export default function GroupMembers({
  membersList,
}: {
  membersList: GroupDetailsType;
}) {
  return (
    <DefaultCard className="w-full flex flex-col items-start justify-start gap-2 max-h-[80vh]">
      <div className="w-full">
        <h1 className="text-custom-dark-text font-semibold flex gap-1 items-center justify-start text-start">
          Members
        </h1>
        <HRow />
      </div>
      <InnerContainer className="max-h-[90vh]">
        {Object.keys(membersList).map((item) => (
          <GroupMemberTab key={item} data={membersList[item]} />
        ))}
      </InnerContainer>
    </DefaultCard>
  );
}
