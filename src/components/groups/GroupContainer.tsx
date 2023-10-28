"use client";
import React from "react";
import { useProfile } from "@/src/hooks/profile/useProfile";
import GroupsCreatedSection from "./GroupsCreatedSection";
import GroupsJoinedSection from "./GroupsJoinedSection";
import { useOwnedGroups } from "@/src/hooks/groups/useOwnedGroups";
import { useJoinedGroups } from "@/src/hooks/groups/useJoinedGroups";
import LoadingIcon from "../utils/LoadingIcon";
import LoadingScreenSmall from "../screens/LoadingScreenSmall";
import OfflineScreen from "../screens/OfflineScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import ServerErrorScreen from "../screens/ServerErrorScreen";

export default function GroupContainer() {
  const { memberDetails, error } = useProfile();
  const { groupsCreated } = useOwnedGroups();
  const { joinedGroups } = useJoinedGroups();

  if (memberDetails && joinedGroups) {
    const role = memberDetails.role;

    return (
      <div className="flex flex-col gap-10 items-center justify-start w-full">
        {role !== "member" &&
          (groupsCreated ? (
            <GroupsCreatedSection ownedGroups={groupsCreated} />
          ) : (
            <LoadingIcon width={30} height={30} />
          ))}
        <GroupsJoinedSection joinedGroups={joinedGroups} />
      </div>
    );
  } else if (error) {
    if (error.includes("offline")) return <OfflineScreen />;
    if (error.includes("not found")) return <NotFoundScreen />;
    else return <ServerErrorScreen eMsg={error} />;
  }

  return <LoadingScreenSmall />;
}
