import React from "react";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import { cookies } from "next/headers";
import LoadingScreenSmall from "@/src/components/screens/LoadingScreenSmall";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import RestrictedScreen from "@/src/components/screens/RestrictedScreen";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import GroupHeader from "@/src/components/groups/custom/GroupHeader";
import { GROUP_MEMBERS_SCHEMA, GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import GroupMembers from "@/src/components/groups/custom/GroupMembers";
import GroupRequested from "@/src/components/groups/custom/GroupRequested";
import SettingsSection from "@/src/components/groups/custom/settings/SettingsSection";

export async function generateMetadata({
  params,
}: {
  params: { [groupID: string]: string };
}) {
  const groupID = params.groupID;
  return {
    title: groupID,
  };
}

export default async function GroupPage({
  params,
}: {
  params: { [groupID: string]: string };
}) {
  const groupID = params.groupID;
  const cookieStore = cookies();

  const data = cookieStore.get("memberID");

  if (data) {
    const memberID = data.value;
    try {
      const host = process.env.HOST;

      // check if member is in group
      const groupPostObj = GetPostObj({ groupID, memberID });
      const res = await fetch(`${host}/api/groups/memberof`, groupPostObj);
      const body = await res.json();
      if (!body.status) return <RestrictedScreen />;
      const { role } = body.data as GROUP_MEMBERS_SCHEMA;
      const owner = role === "owner";

      // get group data
      const PostObj = GetPostObj({ groupID });
      const resA = await fetch(`${host}/api/groups/custom`, PostObj);
      const bodyA = await resA.json();

      if (!bodyA.status) throw new Error(bodyA.error);
      const { createdBy, groupName, groupDesc } = bodyA.data as GROUP_SCHEMA;
      return (
        <>
          <HeaderBar back text={groupID} />
          <div className="flex flex-col items-center justify-start w-full gap-4">
            <GroupHeader owner={createdBy} title={groupName} desc={groupDesc} />
            {owner && <GroupRequested groupID={groupID} />}
            <GroupMembers groupID={groupID} />
            {owner && <SettingsSection groupID={groupID} />}
          </div>
        </>
      );
    } catch (err: any) {
      return ErrorScreenHandler(err);
    }
  }
  return <LoadingScreenSmall />;
}
