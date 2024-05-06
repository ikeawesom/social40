import React, { Suspense } from "react";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import { cookies } from "next/headers";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import RestrictedScreen from "@/src/components/screens/RestrictedScreen";
import GroupHeader from "@/src/components/groups/custom/GroupHeader";
import { GROUP_MEMBERS_SCHEMA, GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import GroupRequested from "@/src/components/groups/custom/requests/GroupRequested";
import SettingsSection from "@/src/components/groups/custom/settings/SettingsSection";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import { GROUP_ROLES_HEIRARCHY } from "@/src/utils/constants";
import { dbHandler } from "@/src/firebase/db";
import LeaveGroupSection from "@/src/components/groups/custom/settings/LeaveGroupSection";
import CosSection from "@/src/components/groups/custom/cos/CosSection";
import { GroupActivitiesServer } from "@/src/components/groups/custom/activities/GroupActivitiesServer";
import DefaultSkeleton from "@/src/components/utils/DefaultSkeleton";
import { GroupStrengthServer } from "@/src/components/groups/custom/strength/GroupStrengthServer";

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
      const res = await dbHandler.get({
        col_name: `GROUPS/${groupID}/MEMBERS`,
        id: memberID,
      });

      if (!res.status) return <RestrictedScreen />;

      const currentMember = res.data as GROUP_MEMBERS_SCHEMA;
      const { role } = currentMember;
      const owner = role === "owner";
      const admin =
        GROUP_ROLES_HEIRARCHY[role].rank >= GROUP_ROLES_HEIRARCHY["admin"].rank;

      // get group data
      const { data, error } = await dbHandler.get({
        col_name: "GROUPS",
        id: groupID,
      });

      if (error) throw new Error(error);

      const groupData = data as GROUP_SCHEMA;
      const { createdBy, groupName, groupDesc, cos } = groupData;

      return (
        <>
          <HeaderBar back text={groupID} />
          <div className="grid place-items-center">
            <div className="max-w-[500px] w-full">
              <div className="flex flex-col items-center justify-start w-full gap-4">
                <GroupHeader
                  owner={createdBy}
                  title={groupName}
                  desc={groupDesc}
                />
                {admin && <GroupRequested groupID={groupID} />}

                {cos && cos.state && (
                  // (cos?.admins?.includes(memberID) ||
                  //   cos?.members?.includes(memberID)) &&
                  <CosSection
                    cos={cos}
                    curMemberID={memberID}
                    groupID={groupID}
                  />
                )}

                <Suspense fallback={<DefaultSkeleton className="h-[40vh]" />}>
                  <GroupStrengthServer
                    admin={admin}
                    currentMember={JSON.parse(JSON.stringify(currentMember))}
                    groupID={groupID}
                  />
                </Suspense>

                {/* <GroupLeaderboard memberData={groupMembersData} /> */}
                <Suspense fallback={<DefaultSkeleton className="h-[30vh]" />}>
                  <GroupActivitiesServer groupID={groupID} admin={admin} />
                </Suspense>
                {!owner && (
                  <LeaveGroupSection groupID={groupID} curMember={memberID} />
                )}
                {admin && <SettingsSection groupID={groupID} />}
              </div>
            </div>
          </div>
        </>
      );
    } catch (err: any) {
      return ErrorScreenHandler(err);
    }
  }
  return <SignInAgainScreen />;
}
