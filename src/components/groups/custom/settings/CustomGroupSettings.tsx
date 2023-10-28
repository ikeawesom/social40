"use client";
import React from "react";
import { useGroupData } from "@/src/hooks/groups/custom/useGroupData";
import RestrictedScreen from "@/src/components/screens/RestrictedScreen";
import LoadingScreenSmall from "@/src/components/screens/LoadingScreenSmall";
import NotFoundScreen from "@/src/components/screens/NotFoundScreen";
import OfflineScreen from "@/src/components/screens/OfflineScreen";
import ServerErrorScreen from "@/src/components/screens/ServerErrorScreen";
import EditGroupForm from "./EditGroupForm";
import DeleteGroupSection from "./DeleteGroupSection";

export default function CustomGroupSettings({ groupID }: { groupID: string }) {
  const { data, error, role } = useGroupData(groupID);
  if (data) {
    const owner = role === "owner";
    if (!owner) return <RestrictedScreen />;
    else if (error) {
      if (error.includes("offline")) return <OfflineScreen />;
      if (error.includes("not found")) return <NotFoundScreen />;
      else return <ServerErrorScreen eMsg={error} />;
    }
    return (
      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-[500px]">
        <EditGroupForm groupData={data} />
        <DeleteGroupSection groupData={data} />
      </div>
    );
  }
  return <LoadingScreenSmall />;
}
