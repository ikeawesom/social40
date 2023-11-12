import React from "react";
import DefaultCard from "../DefaultCard";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import Link from "next/link";
import HRow from "../utils/HRow";
import { FetchGroupActivityData } from "@/src/utils/activities/group/FetchData";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import JoinGroupActivityButton from "../groups/custom/activities/JoinGroupActivityButton";
import SecondaryButton from "../utils/SecondaryButton";

export default async function GroupFeedCard({
  activityData,
  memberID,
}: {
  activityData: GROUP_ACTIVITY_SCHEMA;
  memberID: string;
}) {
  try {
    const { activityID, groupID, activityDesc, activityTitle } = activityData;
    const res = await FetchGroupActivityData({
      activityID,
      groupID,
      memberID,
    });
    if (!res.status) throw new Error(res.error);

    const { requested, owner, canJoin, active, dateStr, currentParticipant } =
      res.data;

    return (
      <DefaultCard className="w-full flex flex-col items-start justify-start">
        <p className="text-xs text-custom-grey-text">{groupID}</p>
        <HRow className="mb-2" />
        <Link
          href={`/groups/${activityData.groupID}/activity?${new URLSearchParams(
            {
              id: activityID,
            }
          )}`}
          className="text-start font-semibold text-lg text-custom-dark-text duration-200 hover:opacity-70"
        >
          {activityTitle}
        </Link>
        <p className="text-custom-dark-text text-sm">{activityDesc}</p>
        <p className="text-custom-grey-text text-xs">
          {active ? "Begins on: " : "Ended on: "}
          {dateStr}
        </p>

        <div className="w-full mt-2">
          {owner ? (
            <SecondaryButton
              disabled
              className="border-custom-green text-custom-green text-xs"
            >
              {active
                ? "You are participating in this activity"
                : "You have participated in this activity"}
            </SecondaryButton>
          ) : !currentParticipant ? (
            <JoinGroupActivityButton
              active={active}
              activityID={activityID}
              canJoin={canJoin}
              memberID={memberID}
              requested={requested}
              className="text-xs"
            />
          ) : (
            <SecondaryButton
              disabled
              className="border-custom-green text-custom-green text-xs"
            >
              {active
                ? "You are participating in this activity"
                : "You have participated in this activity"}
            </SecondaryButton>
          )}
        </div>
      </DefaultCard>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
