import DeleteGroupSection from "@/src/components/groups/custom/settings/DeleteGroupSection";
import EditGroupForm from "@/src/components/groups/custom/settings/EditGroupForm";
import PurgeMembersSection from "@/src/components/groups/custom/settings/PurgeMembersSection";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import RestrictedScreen from "@/src/components/screens/RestrictedScreen";
import ServerErrorScreen from "@/src/components/screens/ServerErrorScreen";
import { dbHandler } from "@/src/firebase/db";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import { GROUP_MEMBERS_SCHEMA, GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import { cookies } from "next/headers";
import React from "react";

export default async function GroupSettingsPage({
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
      const owner = role === "owner" || role === "admin";
      if (!owner) return <RestrictedScreen />;

      // get group data
      const PostObj = GetPostObj({ groupID });
      const resA = await fetch(`${host}/api/groups/custom`, PostObj);
      const bodyA = await resA.json();

      if (!bodyA.status) throw new Error(bodyA.error);
      const data = bodyA.data as GROUP_SCHEMA;

      // get group members
      const resB = await dbHandler.getSpecific({
        path: `GROUPS/${groupID}/MEMBERS`,
        orderCol: `role`,
        ascending: true,
      });

      if (!resB.status) throw new Error(resB.error);

      const groupMembers = resB.data as {
        [memberID: string]: GROUP_MEMBERS_SCHEMA;
      };

      return (
        <>
          <HeaderBar back text={`Settings for ${groupID}`} />
          <div className="w-full grid place-items-center">
            <div className="flex flex-col items-center justify-center gap-4 w-full max-w-[500px]">
              <EditGroupForm groupData={data} />
              {/* <PurgeMembersSection
                groupID={groupID}
                groupMembers={JSON.parse(JSON.stringify(groupMembers))}
              /> */}
              {owner && <DeleteGroupSection groupData={data} />}
            </div>
          </div>
        </>
      );
    } catch (err: any) {
      return ErrorScreenHandler(err);
    }
  }
  return <ServerErrorScreen />;
}
