import React from "react";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import GroupHALoadingSkeleton from "@/src/components/groups/custom/HA/GroupHALoadingSkeleton";

export default function loading() {
  return (
    <>
      <HeaderBar text="HA Reports" back />
      <GroupHALoadingSkeleton />
    </>
  );
}
