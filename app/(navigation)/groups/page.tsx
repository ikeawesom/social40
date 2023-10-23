import LoadingScreen from "@/src/components/LoadingScreen";
import GroupsCreatedSection from "@/src/components/groups/GroupsCreatedSection";
import GroupsJoinedSection from "@/src/components/groups/GroupsJoinedSection";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import { getJoinedGroups } from "@/src/utils/groups/getJoinedGroups";
import { getOwnedGroups } from "@/src/utils/groups/getOwnedGroups";
import useFetchUserDataServer from "@/src/utils/useFetchUserDataServer";
import React from "react";

export default async function Groups() {
  const data = useFetchUserDataServer();

  if (data) {
    const memberID = data.memberID;
    const role = data.role;

    const [groupsCreated, groupsJoined] = await Promise.all([
      getOwnedGroups({ memberID }),
      getJoinedGroups({ memberID }),
    ]);
    return (
      <>
        <HeaderBar text="Groups" />
        <div className="flex flex-col gap-10 items-center justify-start w-full">
          {role !== "member" && (
            <GroupsCreatedSection ownedGroups={groupsCreated} />
          )}
          <GroupsJoinedSection joinedGroups={groupsJoined} />
        </div>
      </>
    );
  }
  return <LoadingScreen />;
}
