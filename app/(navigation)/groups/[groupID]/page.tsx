import CustomGroupContainer from "@/src/components/groups/custom/CustomGroupContainer";
import GroupHeader from "@/src/components/groups/custom/GroupHeader";
import GroupRequested from "@/src/components/groups/custom/GroupRequested";
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
  return (
    <>
      <HeaderBar back text={groupID} />
      <CustomGroupContainer groupID={groupID} />
    </>
  );
}
