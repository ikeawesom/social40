import HeaderBar from "@/src/components/navigation/HeaderBar";
import NotFoundScreen from "@/src/components/screens/NotFoundScreen";
import { dbHandler } from "@/src/firebase/db";
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
  if (res.status)
    // group exists
    return (
      <>
        <HeaderBar back text={groupID} />
        <div className="mt-10">{params["groupID"]}</div>
      </>
    );
  return <NotFoundScreen />;
}
