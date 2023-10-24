import GroupHeader from "@/src/components/groups/custom/GroupHeader";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import NotFoundScreen from "@/src/components/screens/NotFoundScreen";
import OfflineScreen from "@/src/components/screens/OfflineScreen";
import { dbHandler } from "@/src/firebase/db";
import { GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Groups",
};

export default async function GroupPage({
  params,
}: {
  params: { [groupID: string]: string };
}) {
  const groupID = params.groupID;
  const res = await dbHandler.get({ col_name: "GROUPS", id: groupID });
  if (res.status) {
    // group exists
    const data = res.data as GROUP_SCHEMA;
    return (
      <>
        <HeaderBar back text={groupID} />
        <GroupHeader
          owner={data.createdBy}
          title={data.groupName}
          desc={data.groupDesc}
        />
      </>
    );
  }
  return <NotFoundScreen />;
}
