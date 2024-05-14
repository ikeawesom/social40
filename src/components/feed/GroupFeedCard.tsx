import React from "react";
import DefaultCard from "../DefaultCard";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import Link from "next/link";
import HRow from "../utils/HRow";
import { FetchGroupActivityData } from "@/src/utils/activities/group/FetchData";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import JoinGroupActivityButton from "../groups/custom/activities/settings/JoinGroupActivityButton";
import SecondaryButton from "../utils/SecondaryButton";
import DismissButton from "./DismissButton";
import ShowButton from "./ShowButton";
import ActivityStatusTab from "./ActivityStatusTab";

export default async function GroupFeedCard({
  activityData,
  memberID,
  show,
}: {
  activityData: GROUP_ACTIVITY_SCHEMA;
  memberID: string;
  show?: boolean;
}) {
  try {
    const { activityID, groupID, activityDesc, activityTitle } = activityData;
    const host = process.env.HOST as string;

    const res = await FetchGroupActivityData.getMain({
      activityID,
      groupID,
      host,
      memberID,
    });

    if (!res.status) throw new Error(res.error);

    const { canJoin, active, dateStr, currentParticipant, participantsData } =
      res.data;

    const resA = await FetchGroupActivityData.getRequests({
      activityID,
      groupID,
      host,
      memberID,
    });

    if (!resA.status) throw new Error(resA.error);

    const { requested } = resA.data;

    const participantNumber = Object.keys(participantsData).length;
    const randomIndex = Math.floor(Math.random() * participantNumber);

    const randomParticipant = Object.keys(participantsData)[randomIndex];
    const oneParticipant = participantNumber === 1;
    const noParticipant = participantNumber === 0;

    return (
      <DefaultCard className="w-full flex flex-col items-start justify-start">
        <Link
          href={`/groups/${groupID}`}
          className="text-xs text-custom-grey-text duration-150 hover:opacity-70"
        >
          {groupID}
        </Link>
        <HRow className="mb-2" />
        <div className="w-full flex items-center justify-between flex-wrap gap-x-2">
          <Link
            href={`/groups/${
              activityData.groupID
            }/activity?${new URLSearchParams({
              id: activityID,
            })}`}
            className="text-start font-semibold text-lg text-custom-dark-text duration-150 hover:opacity-70"
          >
            {activityTitle}
          </Link>
          <ActivityStatusTab active={active} />
        </div>
        <p className="text-custom-dark-text text-sm">{activityDesc}</p>
        <p className="text-custom-grey-text text-xs">
          {active ? "Begins on: " : "Ended on: "}
          {dateStr}
        </p>

        <Link
          href={`/groups/${activityData.groupID}/activity?${new URLSearchParams(
            {
              id: activityID,
            }
          )}`}
          className="text-sm text-custom-dark-text mt-2"
        >
          {!noParticipant && (
            <>
              <span className="font-semibold">{randomParticipant} </span>
              {oneParticipant ? (
                "is "
              ) : (
                <span>
                  `and{" "}
                  <span className="font-semibold">
                    {participantNumber - 1} others
                  </span>{" "}
                  are{" "}
                </span>
              )}
              participating.
            </>
          )}
        </Link>

        <div className="w-full mt-2 flex items-center justify-end gap-3 max-[350px]:flex-wrap">
          {!currentParticipant ? (
            <JoinGroupActivityButton
              activityID={activityID}
              canJoin={canJoin}
              memberID={memberID}
              requested={requested}
              className="text-xs"
            />
          ) : (
            <SecondaryButton
              disabled
              className="border-custom-green text-custom-green text-xs px-3 min-w-fit"
            >
              {active ? "Participating" : "Participated"}
            </SecondaryButton>
          )}
          {show ? (
            <ShowButton
              activityID={activityID}
              host={host}
              memberID={memberID}
            />
          ) : (
            <DismissButton
              activityID={activityID}
              host={host}
              memberID={memberID}
            />
          )}
        </div>
      </DefaultCard>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
