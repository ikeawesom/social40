import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { cookies } from "next/headers";
import React, { Suspense } from "react";
import ActivityWaitlist from "../ActivityWaitlist";
import GroupActivitySettings from "./GroupActivitySettings";
import DeleteGroupActivity from "./DeleteGroupActivity";
import { FetchGroupActivityData } from "@/src/utils/activities/group/FetchData";
import ActivityRemarks from "../ActivityRemarks";
import DefaultSkeleton from "@/src/components/utils/DefaultSkeleton";
import ActivityParticipants from "../participants/ActivityParticipants";
import GroupActivityDetails from "./GroupActivityDetails";
import GroupActivityJoinSection from "./GroupActivityJoinSection";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import FalloutsCard from "../participants/FalloutsCard";
import ActivityDownloadSection from "../ActivityDownloadSection";
import { TimestampToDateString } from "@/src/utils/getCurrentDate";

export type SuspenseGroupActivityFetchType = {
  memberID: string;
  activityData: GROUP_ACTIVITY_SCHEMA;
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

      const { activityData, active, admin, fallouts } = res.data;

      const resA = await FetchGroupActivityData.getRequests({
        activityID,
        groupID,
        host,
        memberID,
      });

      if (!resA.status) throw new Error(resA.error);

      const { noRequests, requestsData } = resA.data;

      const falloutsLength = Object.keys(fallouts).length;

      return (
        <div className="w-full flex flex-col items-start justify-center gap-4">
          <h1>{TimestampToDateString(activityData.activityDate)}</h1>
          <h1>{TimestampToDateString(activityData.createdOn)}</h1>
          {!noRequests && admin && (
            <ActivityWaitlist
              requestsData={requestsData}
              activityID={activityID}
            />
          )}
          <Suspense fallback={<DefaultSkeleton />}>
            <GroupActivityDetails
              activityData={activityData}
              memberID={memberID}
            />
          </Suspense>
          <Suspense fallback={<DefaultSkeleton className="h-[5vh]" />}>
            <GroupActivityJoinSection
              activityData={activityData}
              memberID={memberID}
            />
          </Suspense>

          <Suspense fallback={<DefaultSkeleton />}>
            <ActivityParticipants
              activityData={activityData}
              memberID={memberID}
            />
          </Suspense>

          {admin && !active && (
            <Suspense fallback={<DefaultSkeleton />}>
              <ActivityRemarks activityID={activityID} groupID={groupID} />
            </Suspense>
          )}
          {admin && falloutsLength > 0 && <FalloutsCard fallouts={fallouts} />}
          {admin && <GroupActivitySettings activityData={activityData} />}
          {admin && <DeleteGroupActivity activityData={activityData} />}
          {admin && (
            <ActivityDownloadSection
              activityData={activityData}
              memberID={memberID}
            />
          )}
          <p className="text-center self-center justify-center text-xs text-custom-grey-text">
            Activity ID: {activityData.activityID}
          </p>
        </div>
      );
    } catch (err: any) {
      return ErrorScreenHandler(err);
    }
  }
  return <SignInAgainScreen />;
}
