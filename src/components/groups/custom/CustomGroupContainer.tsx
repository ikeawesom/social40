"use client";
import React from "react";
import GroupHeader from "./GroupHeader";
import GroupRequested from "./GroupRequested";
import OfflineScreen from "../../screens/OfflineScreen";
import NotFoundScreen from "../../screens/NotFoundScreen";
import LoadingScreenSmall from "../../screens/LoadingScreenSmall";
import { useGroupData } from "@/src/hooks/groups/custom/useGroupData";
import GroupMembers from "./GroupMembers";
import ServerErrorScreen from "../../screens/ServerErrorScreen";
import { useIsGroupMember } from "@/src/hooks/groups/custom/useIsGroupMember";
import RestrictedScreen from "../../screens/RestrictedScreen";

export default function CustomGroupContainer({ groupID }: { groupID: string }) {
  const { valid } = useIsGroupMember(groupID);
  const { data, error, role } = useGroupData(groupID);

  if (valid === false) return <RestrictedScreen />;
  else if (data) {
    return (
      <div className="flex flex-col items-center justify-start w-full gap-4">
        <GroupHeader
          owner={data.createdBy}
          title={data.groupName}
          desc={data.groupDesc}
        />
        {role === "owner" && <GroupRequested groupID={groupID} />}
        <GroupMembers groupID={groupID} />
      </div>
    );
  } else if (error.includes("not found")) {
    // invalid group ID
    return <NotFoundScreen />;
  } else if (error.includes("offline")) {
    // client is offline
    return <OfflineScreen />;
  } else if (error !== "") {
    return <ServerErrorScreen />;
  }
  // loading data
  return <LoadingScreenSmall />;
}
