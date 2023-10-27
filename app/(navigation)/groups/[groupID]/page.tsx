import React from "react";
import { Metadata } from "next";
import CustomGroupContainer from "@/src/components/groups/custom/CustomGroupContainer";
import HeaderBar from "@/src/components/navigation/HeaderBar";

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
