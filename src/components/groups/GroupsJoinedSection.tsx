import React from "react";
import HRow from "../utils/HRow";
import SearchGroups from "./SearchGroups";
import GroupItem from "./GroupItem";
import { MEMBER_JOINED_GROUPS_SCHEMA } from "@/src/utils/schemas/members";

export default function GroupsJoinedSection({
  joinedGroups,
}: {
  joinedGroups: MEMBER_JOINED_GROUPS_SCHEMA;
}) {
  const empty = Object.keys(joinedGroups).length === 0;

  return (
    <div className="flex flex-col gap-y-1 items-start justify-start w-full">
      <h1 className="font-bold text-custom-dark-text">Joined Groups</h1>
      <HRow className="bg-custom-grey-text mb-1 mt-0" />
      <SearchGroups />
      {!empty ? (
        Object.keys(joinedGroups).map((groupID: string) => (
          <GroupItem
            key={groupID}
            title={groupID}
            subtitle={`Joined on: ${joinedGroups[groupID]["dateJoined"]}`}
          />
        ))
      ) : (
        <>
          <h1 className="text-custom-grey-text text-sm">
            You have not joined any groups.
          </h1>
        </>
      )}
    </div>
  );
}
