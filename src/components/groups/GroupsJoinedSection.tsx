import { ownedGroupsType } from "@/src/utils/groups/getOwnedGroups";
import React from "react";
import HRow from "../utils/HRow";
import Link from "next/link";
import { joinedGroupsType } from "@/src/utils/groups/getJoinedGroups";

export default function GroupsJoinedSection({
  joinedGroups,
}: {
  joinedGroups: joinedGroupsType;
}) {
  console.log(joinedGroups);

  const empty = Object.keys(joinedGroups).length === 0;

  return (
    <div className="flex flex-col gap-y-1 items-start justify-start w-full">
      <h1 className="font-bold text-custom-dark-text">My Groups</h1>
      <HRow className="bg-custom-grey-text mb-1 mt-0" />
      {!empty ? (
        Object.keys(joinedGroups).map((groupID: string) => (
          <Link
            href={`/groups/${groupID}`}
            className="flex flex-col items-start justify-center w-full bg-white rounded-lg py-1 px-2"
            key={groupID}
          >
            <h1 className="font-bold">{joinedGroups[groupID]["groupID"]}</h1>
            <p className="text-xs text-custom-grey-text">
              Joined on: {joinedGroups[groupID]["dateJoined"]}
            </p>
          </Link>
        ))
      ) : (
        <>
          <h1>You have not joined any groups.</h1>
        </>
      )}
    </div>
  );
}
