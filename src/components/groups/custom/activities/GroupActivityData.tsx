import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { cookies } from "next/headers";
import React, { Suspense } from "react";
import ActivityWaitlist from "./ActivityWaitlist";
import GroupActivitySettings from "./GroupActivitySettings";
import DeleteGroupActivity from "./DeleteGroupActivity";
import { FetchGroupActivityData } from "@/src/utils/activities/group/FetchData";
import ActivityRemarks from "./ActivityRemarks";
import DefaultSkeleton from "@/src/components/utils/DefaultSkeleton";
import ActivityParticipants from "./ActivityParticipants";
import GroupActivityDetails from "./GroupActivityDetails";
import GroupActivityJoinSection from "./GroupActivityJoinSection";

export type SuspenseGroupActivityFetchType = {
  groupID: string;
  activityID: string;
  memberID: string;
};

export default async function GroupActivityData({
  activityID,
  groupID,
}: {
  activityID: string;
  groupID: string;
}) {
  // fetch activity data
  const cookieStore = cookies();

  const data = cookieStore.get("memberID");

  if (data) {
    const memberID = data.value;

    try {
      const host = process.env.HOST as string;

      const res = await FetchGroupActivityData.getMain({
        activityID,
        groupID,
        host,
        memberID,
      });

      if (!res.status) throw new Error(res.error);

      const { activityData, owner, active } = res.data;

      const resA = await FetchGroupActivityData.getRequests({
        activityID,
        groupID,
        host,
        memberID,
      });

      if (!resA.status) throw new Error(resA.error);

      const { noRequests, requestsData } = resA.data;

      return (
        <div className="w-full flex flex-col items-start justify-center gap-4">
          {!noRequests && owner && (
            <ActivityWaitlist
              requestsData={requestsData}
              activityID={activityID}
            />
          )}
          <Suspense fallback={<DefaultSkeleton />}>
            <GroupActivityDetails
              activityID={activityID}
              groupID={groupID}
              memberID={memberID}
            />
          </Suspense>
          <Suspense fallback={<DefaultSkeleton className="h-[5vh]" />}>
            <GroupActivityJoinSection
              activityID={activityID}
              groupID={groupID}
              memberID={memberID}
            />
          </Suspense>

          <Suspense fallback={<DefaultSkeleton />}>
            <ActivityParticipants
              activityID={activityID}
              groupID={groupID}
              memberID={memberID}
            />
          </Suspense>

          {owner && !active && (
            <Suspense fallback={<DefaultSkeleton />}>
              <ActivityRemarks activityID={activityID} groupID={groupID} />
            </Suspense>
          )}
          {owner && <GroupActivitySettings activityData={activityData} />}
          {owner && <DeleteGroupActivity activityData={activityData} />}
        </div>
      );
    } catch (err: any) {
      return ErrorScreenHandler(err);
    }
  }
  return <SignInAgainScreen />;
}
