import React from "react";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import GroupContainer from "@/src/components/groups/GroupContainer";

export default async function Groups() {
  return (
    <>
      <HeaderBar text="Groups" />
      <GroupContainer />
    </>
  );
}
