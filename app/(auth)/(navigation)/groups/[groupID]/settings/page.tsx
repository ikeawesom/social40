import DeleteGroupSection from "@/src/components/groups/custom/settings/DeleteGroupSection";
import EditGroupForm from "@/src/components/groups/custom/settings/EditGroupForm";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import RestrictedScreen from "@/src/components/screens/RestrictedScreen";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import React from "react";
import { getMemberAuthServer } from "@/src/utils/auth/handleServerAuth";
import { getGroupData } from "@/src/utils/groups/getGroupData";
import { getSimple } from "@/src/utils/helpers/parser";

export default async function GroupSettingsPage({
  params,
}: {
  params: { [groupID: string]: string };
}) {
  const groupID = params.groupID;
  const { user, isAuthenticated } = await getMemberAuthServer();
  if (!isAuthenticated || user === null) return;
  const { memberID } = user;
  const host = process.env.HOST;

  try {
    // check if member is in group
    const { data, error } = await getGroupData(groupID, memberID);
    if (error) {
      if (error.message === "RESTRICTED") {
        return <RestrictedScreen />;
      } else {
        throw new Error(error);
      }
    }
    const { groupData, owner } = data;

    const parsed = getSimple(groupData);

    // -- for purging members --
    // // get group members
    // const resB = await dbHandler.getSpecific({
    //   path: `GROUPS/${groupID}/MEMBERS`,
    //   orderCol: `role`,
    //   ascending: true,
    // });

    // if (!resB.status) throw new Error(resB.error);

    // const groupMembers = resB.data as {
    //   [memberID: string]: GROUP_MEMBERS_SCHEMA;
    // };

    return (
      <>
        <HeaderBar back text={`Settings for ${groupID}`} />
        <div className="w-full grid place-items-center">
          <div className="flex flex-col items-center justify-center gap-4 w-full max-w-[500px]">
            <EditGroupForm groupData={parsed} />
            {/* <PurgeMembersSection
                groupID={groupID}
                groupMembers={JSON.parse(JSON.stringify(groupMembers))}
              /> */}
            {owner && <DeleteGroupSection groupData={parsed} />}
          </div>
        </div>
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
