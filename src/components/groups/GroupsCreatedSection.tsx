"use client";
import { ownedGroupsType } from "@/src/utils/groups/getOwnedGroups";
import React from "react";
import HRow from "../utils/HRow";
import { useRouter } from "next/navigation";

export default function GroupsCreatedSection({
  ownedGroups,
}: {
  ownedGroups: ownedGroupsType;
}) {
  const empty = Object.keys(ownedGroups).length === 0;
  const router = useRouter();
  return (
    <div className="flex flex-col gap-y-1 items-start justify-start w-full">
      <h1 className="font-bold text-custom-dark-text">My Groups</h1>
      <HRow className="bg-custom-grey-text mb-1 mt-0" />
      {!empty ? (
        Object.keys(ownedGroups).map((groupID: string) => (
          <div
            onClick={() => router.push(`/groups/${groupID}`, { scroll: false })}
            className="flex flex-col items-start justify-center w-full bg-white rounded-lg py-1 px-2"
            key={groupID}
          >
            <h1 className="font-bold">{ownedGroups[groupID]["groupID"]}</h1>
            <p className="text-xs text-custom-grey-text">
              Created on: {ownedGroups[groupID]["createdOn"]}
            </p>
          </div>
        ))
      ) : (
        <>
          <h1>You have not created any groups.</h1>
        </>
      )}
    </div>
  );
}
