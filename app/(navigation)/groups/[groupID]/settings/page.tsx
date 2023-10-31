import DeleteGroupSection from "@/src/components/groups/custom/settings/DeleteGroupSection";
import EditGroupForm from "@/src/components/groups/custom/settings/EditGroupForm";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import LoadingScreenSmall from "@/src/components/screens/LoadingScreenSmall";
import RestrictedScreen from "@/src/components/screens/RestrictedScreen";
import ServerErrorScreen from "@/src/components/screens/ServerErrorScreen";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
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
      const owner = role === "owner";
      if (!owner) return <RestrictedScreen />;

      // get group data
      const PostObj = GetPostObj({ groupID });
      const resA = await fetch(`${host}/api/groups/custom`, PostObj);
      const bodyA = await resA.json();

      if (!bodyA.status) throw new Error(bodyA.error);
      const data = bodyA.data as GROUP_SCHEMA;

      return (
        <>
          <HeaderBar back text={`Settings for ${groupID}`} />
          <div className="w-full grid place-items-center">
            <div className="flex flex-col items-center justify-center gap-4 w-full max-w-[500px]">
              <EditGroupForm groupData={data} />
              <DeleteGroupSection groupData={data} />
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
