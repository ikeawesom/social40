import CustomGroupSettings from "@/src/components/groups/custom/settings/CustomGroupSettings";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import React from "react";

export default function GroupSettingsPage({
  params,
}: {
  params: { [groupID: string]: string };
}) {
  const groupID = params.groupID;
  return (
    <>
      <HeaderBar back text={`Settings for ${groupID}`} />
      <CustomGroupSettings groupID={groupID} />
    </>
  );
}
