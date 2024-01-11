"use client";
import React, { useEffect, useState } from "react";
import DefaultCard from "../DefaultCard";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import Link from "next/link";
import HRow from "../utils/HRow";
import { FetchGroupActivityData } from "@/src/utils/activities/group/FetchData";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import JoinGroupActivityButton from "../groups/custom/activities/JoinGroupActivityButton";
import SecondaryButton from "../utils/SecondaryButton";
import DismissButton from "./DismissButton";
import ShowButton from "./ShowButton";
import { useHostname } from "@/src/hooks/useHostname";
import DefaultSkeleton from "../utils/DefaultSkeleton";

export default function GroupFeedCard({
  activityData,
  memberID,
  show,
}: {
  activityData: GROUP_ACTIVITY_SCHEMA;
  memberID: string;
  show?: boolean;
}) {
  const { host } = useHostname();
  const [error, setError] = useState("");
  const [res, setRes] = useState<any>();
  const [resA, setResA] = useState<any>();
  const { activityID, groupID, activityDesc, activityTitle } = activityData;

  useEffect(() => {
    const init = async () => {
      try {
        const res = await FetchGroupActivityData.getMain({
          activityID,
          groupID,
          host,
          memberID,
        });

        if (!res.status) throw new Error(res.error);
        setRes(res.data);

        const resA = await FetchGroupActivityData.getRequests({
          activityID,
          groupID,
          host,
          memberID,
        });

        if (!resA.status) throw new Error(resA.error);
        setResA(resA.data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    init();
  }, []);

  if (res && resA) {
    const { requested } = resA;

    const participantNumber = Object.keys(res.participantsData).length;
    const randomIndex = Math.floor(Math.random() * participantNumber);

    const randomParticipant = Object.keys(res.participantsData)[randomIndex];
    const oneParticipant = participantNumber - 1 === 0;

    return (
      <DefaultCard className="w-full flex flex-col items-start justify-start">
        <Link
          href={`/groups/${groupID}`}
          className="text-xs text-custom-grey-text duration-200 hover:opacity-70"
        >
          {groupID}
        </Link>
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
          {res.active ? "Begins on: " : "Ended on: "}
          {res.dateStr}
        </p>

        <Link
          href={`/groups/${activityData.groupID}/activity?${new URLSearchParams(
            {
              id: activityID,
            }
          )}`}
          className="text-sm text-custom-dark-text mt-2"
        >
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
        </Link>

        <div className="w-full mt-2 flex items-center justify-between gap-3">
          {res.owner ? (
            <SecondaryButton
              disabled
              className="border-custom-green text-custom-green text-xs"
            >
              {res.active
                ? "You created this activity"
                : "You have participated in this activity"}
            </SecondaryButton>
          ) : !res.currentParticipant ? (
            <JoinGroupActivityButton
              active={res.active}
              activityID={activityID}
              canJoin={res.canJoin}
              memberID={memberID}
              requested={requested}
              className="text-xs"
            />
          ) : (
            <SecondaryButton
              disabled
              className="border-custom-green text-custom-green text-xs"
            >
              {res.active
                ? "You are participating in this activity"
                : "You have participated in this activity"}
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
  } else if (error !== "") {
    return ErrorScreenHandler(error);
  } else {
    return <DefaultSkeleton />;
  }
}
