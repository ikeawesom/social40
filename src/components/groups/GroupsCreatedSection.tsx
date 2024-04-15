import React from "react";
import HRow from "../utils/HRow";
import { ownedGroupsType } from "@/src/utils/groups/getOwnedGroups";
import GroupItem from "./GroupItem";
import CreateGroupContainer from "./create/CreateGroupContainer";
import {
  DateToString,
  TimestampToDate,
  TimestampToDateString,
} from "@/src/utils/getCurrentDate";

export default function GroupsCreatedSection({
  ownedGroups,
}: {
  ownedGroups: ownedGroupsType;
}) {
  const empty = Object.keys(ownedGroups).length === 0;

  return (
    <div className="flex flex-col gap-y-1 items-start justify-start w-full">
      <h1 className="font-bold text-custom-dark-text">Created Groups</h1>
      <HRow className="bg-custom-grey-text mb-1 mt-0" />
      <CreateGroupContainer />
      {!empty ? (
        Object.keys(ownedGroups).map((groupID: string) => {
          const timestamp = ownedGroups[groupID]["createdOn"];
          return (
            <GroupItem
              key={groupID}
              title={groupID}
              subtitle={`Created on: ${TimestampToDateString(timestamp)}`}
            />
          );
        })
      ) : (
        <>
          <h1 className="text-custom-grey-text text-sm">
            You have not created any groups.
          </h1>
        </>
      )}
    </div>
  );
}
