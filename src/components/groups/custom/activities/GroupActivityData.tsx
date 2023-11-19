import DefaultCard from "@/src/components/DefaultCard";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import HRow from "@/src/components/utils/HRow";
import InnerContainer from "@/src/components/utils/InnerContainer";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { TimestampToDateString } from "@/src/utils/getCurrentDate";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";
import JoinGroupActivityButton from "./JoinGroupActivityButton";
import ActivityWaitlist from "./ActivityWaitlist";
import LeaveActivityButton from "./LeaveActivityButton";
import GroupActivitySettings from "./GroupActivitySettings";
import DeleteGroupActivity from "./DeleteGroupActivity";
import { FetchGroupActivityData } from "@/src/utils/activities/group/FetchData";
import AddRemarkButton from "./AddRemarkButton";

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
      const res = await FetchGroupActivityData({
        activityID,
        groupID,
        memberID,
      });
      if (!res.status) throw new Error(res.error);

      const {
        requested,
        noRequests,
        owner,
        canJoin,
        active,
        dateStr,
        requestsData,
        activityData,
        currentParticipant,
        participantsData,
      } = res.data;

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
          {!currentParticipant ? (
            <JoinGroupActivityButton
              active={active}
              activityID={activityID}
              memberID={memberID}
              canJoin={canJoin}
              requested={requested}
            />
          ) : (
            !owner && (
              <LeaveActivityButton
                active={active}
                activityID={activityID}
                memberID={memberID}
              />
            )
          )}
          {currentParticipant && !active && (
            <div className="flex flex-col items-start justify-start w-full gap-1">
              <AddRemarkButton activityID={activityID} memberID={memberID} />
              <p className="text-custom-grey-text text-sm text-start">
                This helps provide feedback for future trainings.
              </p>
            </div>
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
