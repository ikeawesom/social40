import DefaultCard from "@/src/components/DefaultCard";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import HRow from "@/src/components/utils/HRow";
import InnerContainer from "@/src/components/utils/InnerContainer";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import {
  ActiveTimestamp,
  TimestampToDateString,
} from "@/src/utils/getCurrentDate";
import {
  GROUP_ACTIVITY_PARTICIPANT,
  GROUP_ACTIVITY_SCHEMA,
} from "@/src/utils/schemas/group-activities";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";
import JoinGroupActivityButton from "./JoinGroupActivityButton";
import ActivityWaitlist, { ActivityWaitlistType } from "./ActivityWaitlist";
import LeaveActivityButton from "./LeaveActivityButton";

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
  const host = process.env.HOST;

  if (data) {
    const memberID = data.value;

    try {
      // check if logged in member is member of group
      const UserObj = GetPostObj({ memberID, groupID });
      const res = await fetch(`${host}/api/groups/memberof`, UserObj);
      const body = await res.json();

      // get group activity data
      const PostObjActivity = GetPostObj({ activityID });
      const resA = await fetch(
        `${host}/api/activity/group-get`,
        PostObjActivity
      );
      const bodyA = await resA.json();

      if (!bodyA.status) throw new Error(bodyA.error);

      const activityData = bodyA.data.activityData as GROUP_ACTIVITY_SCHEMA;
      const participantsData = bodyA.data.participantsData as {
        [memberID: string]: GROUP_ACTIVITY_PARTICIPANT;
      };

      let currrentParticipant = false;

      if (memberID in participantsData) currrentParticipant = true;

      const date = activityData.activityDate;
      const active = ActiveTimestamp(date);
      const dateStr = TimestampToDateString(date);
      const restrictionStatus = activityData.groupRestriction && body.status;
      const canJoin = restrictionStatus && active && !currrentParticipant;

      const owner = body.status ? body.data.role === "owner" : false;

      // get group activity requests
      const resB = await fetch(
        `${host}/api/activity/group-get-requests`,
        PostObjActivity
      );
      const bodyB = await resB.json();

      if (!bodyB.status) throw new Error(bodyB.error);

      const requestsData = bodyB.data as ActivityWaitlistType;
      const noRequests = Object.keys(requestsData).length === 0;

      // check if current member is in waiting list
      const requested = memberID in requestsData;

      return (
        <div className="w-full flex flex-col items-start justify-center gap-4 max-w-[500px]">
          {!noRequests && owner && (
            <ActivityWaitlist
              requestsData={requestsData}
              activityID={activityID}
            />
          )}
          <DefaultCard className="w-full flex flex-col items-start justify-center gap-2">
            <div className="w-full flex flex-col items-start justify-center">
              <h1 className="text-custom-dark-text font-semibold text-2xl">
                {activityData.activityTitle}
              </h1>
              <h4 className="text-custom-dark-text text-lg">
                {activityData.activityDesc}
              </h4>
              <p className="text-custom-dark-text text-sm">
                {active ? "Begins on: " : "Ended on: "}
                {dateStr}
              </p>
            </div>
            <HRow />
            <div className="w-full flex flex-col items-start justify-center">
              <p className="text-custom-grey-text text-sm">
                Created by: {activityData.createdBy}
              </p>
              <p className="text-custom-grey-text text-sm">
                Created on: {TimestampToDateString(activityData.createdOn)}
              </p>
            </div>
          </DefaultCard>
          {!currrentParticipant ? (
            <JoinGroupActivityButton
              activityID={activityID}
              memberID={memberID}
              canJoin={canJoin}
              requested={requested}
            />
          ) : (
            !owner && (
              <LeaveActivityButton
                activityID={activityID}
                memberID={memberID}
              />
            )
          )}
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
    } catch (err: any) {
      return ErrorScreenHandler(err);
    }
  }
  return <SignInAgainScreen />;
}
