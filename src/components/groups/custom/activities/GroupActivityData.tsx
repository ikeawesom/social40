import DefaultCard from "@/src/components/DefaultCard";
import HRow from "@/src/components/utils/HRow";
import InnerContainer from "@/src/components/utils/InnerContainer";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import {
  ActiveTimestamp,
  TimestampToDateString,
} from "@/src/utils/getCurrentDate";
import {
  GROUP_ACTIVITY_PARTICIPANT,
  GROUP_ACTIVITY_SCHEMA,
} from "@/src/utils/schemas/group-activities";
import Link from "next/link";
import React from "react";

export default async function GroupActivityData({ id }: { id: string }) {
  // fetch activity data
  const host = process.env.HOST;
  const PostObjActivity = GetPostObj({ id });
  const resA = await fetch(`${host}/api/activity/get`, PostObjActivity);
  const bodyA = await resA.json();

  if (!bodyA.status) throw new Error(bodyA.error);

  const activityData = bodyA.data.activityData as GROUP_ACTIVITY_SCHEMA;
  const participantsData = bodyA.data.participantsData as {
    [memberID: string]: GROUP_ACTIVITY_PARTICIPANT;
  };
  console.log(activityData);
  console.log(participantsData);
  const date = activityData.activityDate;
  const active = ActiveTimestamp(date);
  const dateStr = TimestampToDateString(date);
  return (
    <div className="w-full flex flex-col items-start justify-center gap-4 max-w-[500px]">
      <DefaultCard className="w-full flex flex-col items-start justify-center gap-2">
        <div className="w-full flex flex-col items-start justify-center">
          <h1 className="text-custom-dark-text font-semibold text-xl">
            {activityData.activityTitle}
          </h1>
          <h4 className="text-custom-grey-text">{activityData.activityDesc}</h4>
          <p className="text-custom-grey-text text-sm">
            {active ? "Begins on: " : "Ends on: "}
            {dateStr}
          </p>
        </div>
        <HRow />
        <div className="w-full flex flex-col items-start justify-center">
          <p className="text-custom-dark-text">
            Created by: {activityData.createdBy}
          </p>
          <p className="text-custom-dark-text">
            Created on: {TimestampToDateString(activityData.createdOn)}
          </p>
        </div>
      </DefaultCard>
      <DefaultCard className="w-full flex flex-col items-start justify-center gap-2">
        <div className="w-full flex flex-col items-start justify-center">
          <h1 className="text-custom-dark-text font-semibold">
            Participants ( {Object.keys(participantsData).length} )
          </h1>
          <HRow />
        </div>
        <InnerContainer className="w-full">
          {Object.keys(participantsData).map((memberID: string) => {
            const date = participantsData[memberID].dateJoined;
            const dateStr = TimestampToDateString(date);
            return (
              <Link
                key={memberID}
                href={`/members/${memberID}`}
                className="w-full flex flex-col items-start justify-center py-2 px-3 duration-200 hover:bg-custom-light-text"
              >
                <h1 className="text-custom-dark-text font-semibold">
                  {memberID}
                </h1>
                <h4 className="text-custom-grey-text text-sm">
                  Participated on: {dateStr}
                </h4>
              </Link>
            );
          })}
        </InnerContainer>
      </DefaultCard>
    </div>
  );
}
