"use client";
import React from "react";
import GroupHeader from "./GroupHeader";
import GroupRequested from "./GroupRequested";
import OfflineScreen from "../../screens/OfflineScreen";
import NotFoundScreen from "../../screens/NotFoundScreen";
import LoadingScreenSmall from "../../screens/LoadingScreenSmall";
import { useGroupData } from "@/src/hooks/groups/custom/useGroupData";

export default function CustomGroupContainer({ groupID }: { groupID: string }) {
  const { data, error, role } = useGroupData(groupID);

  if (data) {
    return (
      <div className="flex flex-col items-center justify-start w-full gap-4">
        <GroupHeader
          owner={data.createdBy}
          title={data.groupName}
          desc={data.groupDesc}
        />
        {role === "owner" && <GroupRequested groupID={groupID} />}
      </div>
    );
  } else if (error.includes("not found")) {
    // invalid group ID
    return <NotFoundScreen />;
  } else if (error.includes("offline")) {
    // client is offline
    return <OfflineScreen />;
  }
  // loading data
  return <LoadingScreenSmall />;
}
