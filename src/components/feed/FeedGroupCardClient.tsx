"use client";

import { FetchGroupActivityData } from "@/src/utils/activities/group/FetchData";
import { GROUP_ACTIVITY_PARTICIPANT } from "@/src/utils/schemas/group-activities";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import DefaultCard from "../DefaultCard";
import JoinGroupActivityButton from "../groups/custom/activities/settings/JoinGroupActivityButton";
import HRow from "../utils/HRow";
import SecondaryButton from "../utils/SecondaryButton";
import ActivityStatusTab from "./ActivityStatusTab";
import DismissButton from "./DismissButton";
import Image from "next/image";
import { useHostname } from "@/src/hooks/useHostname";
import FeedGroupCardSkeleton from "./FeedGroupCardSkeleton";
import { GROUP_ACTIVITIES_SCHEMA } from "@/src/utils/schemas/groups";
import { twMerge } from "tailwind-merge";
import ShowButton from "./ShowButton";
import { DateToString, StringToDate } from "@/src/utils/helpers/getCurrentDate";

export default function FeedGroupCardClient({
  activityData,
  memberID,
  index,
  toggleView,
  show,
}: {
  show?: boolean;
  activityData: GROUP_ACTIVITIES_SCHEMA;
  memberID: string;
  index: number;
  toggleView: () => void;
}) {
  const [updatedData, setUpdatedData] = useState<{
    canJoin: boolean;
    active: boolean;
    dateStr: string;
    currentParticipant: boolean;
    participantsData: {
      [memberID: string]: GROUP_ACTIVITY_PARTICIPANT;
    };
    requested: boolean;
  }>();
  const [toggle, setToggle] = useState(false);

  const { activityID, groupID, activityDesc, activityTitle, isPT } =
    activityData;

  const { host } = useHostname();

  const toggleAnimation = () => {
    setToggle(true);
    setTimeout(() => {
      toggleView();
    }, 500);
  };

  const fetchData = async () => {
    try {
      const res = await FetchGroupActivityData.getMain({
        activityID,
        groupID,
        host,
        memberID,
      });

      if (!res.status) throw new Error(res.error);

      const {
        canJoin,
        active,
        dateStr: tempDateStr,
        currentParticipant,
        participantsData,
      } = res.data;

      const tempDate = StringToDate(tempDateStr).data as Date;
      tempDate.setHours(tempDate.getHours() - 8);
      const dateStr = DateToString(tempDate);

      const resA = await FetchGroupActivityData.getRequests({
        activityID,
        groupID,
        host,
        memberID,
      });

      if (!resA.status) throw new Error(resA.error);

      const { requested } = resA.data;

      setUpdatedData({
        active,
        dateStr,
        currentParticipant,
        participantsData,
        canJoin,
        requested,
      });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (memberID !== "") fetchData();
  }, [memberID]);

  if (!updatedData) return <FeedGroupCardSkeleton />;

  const {
    requested,
    active,
    canJoin,
    currentParticipant,
    dateStr,
    participantsData,
  } = updatedData;

  const participantNumber = Object.keys(participantsData).length;
  // const randomIndex = Math.floor(Math.random() * participantNumber);

  const randomParticipant =
    Object.keys(participantsData)[index % Object.keys(participantsData).length];
  const oneParticipant = participantNumber === 1;
  const noParticipant = participantNumber === 0;

  return (
    <DefaultCard
      className={twMerge(
        "w-full flex flex-col items-start justify-start",
        toggle && (!show ? "dismiss-activity" : "show-activity")
      )}
    >
      <Link
        scroll={false}
        href={`/groups/${groupID}`}
        className="text-xs text-custom-grey-text duration-150 hover:opacity-70"
      >
        {groupID}
      </Link>
      <HRow className="mb-2" />
      <div className="w-full flex items-center justify-between flex-wrap gap-x-2">
        <Link
          scroll={false}
          href={`/groups/${activityData.groupID}/activity?${new URLSearchParams(
            {
              id: activityID,
            }
          )}`}
          className="text-start font-semibold text-lg text-custom-dark-text flex items-start justify-start gap-2 hover:opacity-70"
        >
          {activityTitle}
          {isPT && (
            <Image
              alt="PT activity"
              className="my-1"
              src="/icons/features/icon_activities_active.svg"
              width={20}
              height={20}
            />
          )}
        </Link>
        <ActivityStatusTab active={active} />
      </div>
      <p className="text-custom-dark-text text-sm">{activityDesc}</p>
      <p className="text-custom-grey-text text-xs">
        {active ? "Begins on: " : "Ended on: "}
        {dateStr}
      </p>

      <Link
        scroll={false}
        href={`/groups/${activityData.groupID}/activity?${new URLSearchParams({
          id: activityID,
        })}`}
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
            toggleView={toggleAnimation}
            activityID={activityID}
            host={host}
            memberID={memberID}
          />
        ) : (
          <DismissButton
            toggleView={toggleAnimation}
            activityID={activityID}
            host={host}
            memberID={memberID}
          />
        )}
      </div>
    </DefaultCard>
  );
}
