import React, { Suspense } from "react";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import { cookies } from "next/headers";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import RestrictedScreen from "@/src/components/screens/RestrictedScreen";
import GroupHeader from "@/src/components/groups/custom/GroupHeader";
import GroupRequested from "@/src/components/groups/custom/requests/GroupRequested";
import SettingsSection from "@/src/components/groups/custom/settings/SettingsSection";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import LeaveGroupSection from "@/src/components/groups/custom/settings/LeaveGroupSection";
import CosSection from "@/src/components/groups/custom/cos/CosSection";
import { GroupActivitiesServer } from "@/src/components/groups/custom/activities/GroupActivitiesServer";
import DefaultSkeleton from "@/src/components/utils/DefaultSkeleton";
import { GroupStrengthServer } from "@/src/components/groups/custom/strength/GroupStrengthServer";
import DefaultCard from "@/src/components/DefaultCard";
import StrengthSectionSkeleton from "@/src/components/groups/custom/strength/StrengthSectionSkeleton";
import GroupLeaderboard from "@/src/components/groups/custom/GroupLeaderboard";
import { getGroupData } from "@/src/utils/groups/getGroupData";
import PageCenterWrapper from "@/src/components/utils/PageCenterWrapper";
import LeaderboardTabSkeleton from "@/src/components/groups/custom/leaderboard/LeaderboardTabSkeleton";

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
      const { error, data } = await getGroupData(groupID, memberID);
      if (error) throw new Error(error);

      const { groupData, admin, owner, currentMember } = data;
      const { createdBy, groupName, groupDesc, cos, lastUpdatedHA } = groupData;

      return (
        <>
          <HeaderBar back text={groupID} />
          <PageCenterWrapper>
            <div className="flex flex-col items-center justify-start w-full gap-4">
              <GroupHeader
                owner={createdBy}
                title={groupName}
                desc={groupDesc}
              />
              {admin && <GroupRequested groupID={groupID} />}

              {cos && cos.state && (
                <CosSection
                  cos={cos}
                  curMemberID={memberID}
                  groupID={groupID}
                />
              )}

              <DefaultCard className="w-full flex flex-col items-start justify-start gap-2">
                <Suspense fallback={<StrengthSectionSkeleton />}>
                  <GroupStrengthServer
                    lastUpdatedHA={lastUpdatedHA}
                    admin={admin}
                    currentMember={JSON.parse(JSON.stringify(currentMember))}
                    groupID={groupID}
                  />
                </Suspense>
              </DefaultCard>
              <DefaultCard className="w-full">
                <h1 className="text-custom-dark-text font-semibold">
                  Overall Leaderboard
                </h1>
                <Suspense
                  fallback={
                    <div className="flex flex-col w-full items-start justify-start gap-3 mt-4">
                      <LeaderboardTabSkeleton isBest />
                      <LeaderboardTabSkeleton />
                      <LeaderboardTabSkeleton />
                    </div>
                  }
                >
                  <GroupLeaderboard
                    curMember={memberID}
                    groupID={groupID}
                    admin={admin}
                  />
                </Suspense>
              </DefaultCard>
              <Suspense fallback={<DefaultSkeleton className="h-[30vh]" />}>
                <GroupActivitiesServer groupID={groupID} admin={admin} />
              </Suspense>
              {!owner && (
                <LeaveGroupSection groupID={groupID} curMember={memberID} />
              )}
              {admin && <SettingsSection groupID={groupID} />}
            </div>
          </PageCenterWrapper>
        </>
      );
    } catch (err: any) {
      if (err.message === "RESTRICTED") return <RestrictedScreen />;
      return ErrorScreenHandler(err);
    }
  }
  return <SignInAgainScreen />;
}
