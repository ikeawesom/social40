import DefaultCard from "@/src/components/DefaultCard";
import RestrictedScreen from "@/src/components/screens/RestrictedScreen";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import HRow from "@/src/components/utils/HRow";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { FetchGroupActivityData } from "@/src/utils/activities/group/FetchData";
import { TimestampToDateString } from "@/src/utils/helpers/getCurrentDate";
import {
  GROUP_ACTIVITY_SCHEMA,
  REMARKS_SCHEMA,
} from "@/src/utils/schemas/group-activities";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";

export default async function ActivityRemarkData({
  activityID,
  groupID,
  remarkID,
}: {
  activityID: string;
  groupID: string;
  remarkID: string;
}) {
  // fetch activity data
  const cookieStore = cookies();

  const data = cookieStore.get("memberID");

  if (data) {
    const storedMemberID = data.value;
    const host = process.env.HOST as string;

    const res = await FetchGroupActivityData.getMain({
      activityID,
      groupID,
      memberID: storedMemberID,
      host,
    });
    if (!res.status) throw new Error(res.error);

    const { owner, activityData } = res.data;

    if (!owner) return <RestrictedScreen />;

    const RemarkObj = GetPostObj({ remarkID, activityID });
    const resA = await fetch(
      `${host}/api/activity/group-get-specific-remark`,
      RemarkObj
    );
    const bodyA = await resA.json();

    if (!bodyA.status) throw new Error(bodyA.error);

    const { createdOn, memberID, remarkTitle, remarks, read } =
      bodyA.data as REMARKS_SCHEMA;

    const { readOn, status } = read;

    const { activityTitle } = activityData as GROUP_ACTIVITY_SCHEMA;

    if (!status) {
      const resB = await fetch(
        `${host}/api/activity/group-set-remark-read`,
        RemarkObj
      );
      const bodyB = await resB.json();

      if (!bodyB.status) throw new Error(bodyB.error);
    }

    return (
      <div className="w-full flex flex-col items-center justify-start gap-2">
        <DefaultCard className="w-full flex flex-col items-start justify-start">
          <Link
            scroll={false}
            href={`/groups/${groupID}/activity?${new URLSearchParams({
              id: activityID,
            })}`}
            className="text-sm text-custom-grey-text text-start duration-150 hover:opacity-70"
          >
            {activityTitle}
          </Link>
          <HRow className="mb-2" />
          <h1 className="text-xl text-custom-dark-text font-semibold">
            {remarkTitle}
          </h1>
          <p className="text-custom-dark-text">{remarks}</p>
          <div className="w-full flex flex-col items-start justify-center mt-2">
            <p className="text-custom-grey-text text-sm">
              Submitted by: {memberID}
            </p>
            <p className="text-custom-grey-text text-sm">
              Submitted on: {TimestampToDateString(createdOn)}
            </p>
          </div>
        </DefaultCard>
        {status && (
          <p className="text-center text-custom-grey-text text-sm">
            Read on: {TimestampToDateString(readOn)}
          </p>
        )}
      </div>
    );
  }
  return <SignInAgainScreen />;
}
