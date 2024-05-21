import DefaultCard from "@/src/components/DefaultCard";
import ActivityStatusTab from "@/src/components/feed/ActivityStatusTab";
import {
  ActiveTimestamp,
  DateToString,
  DateToTimestamp,
} from "@/src/utils/helpers/getCurrentDate";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function AllActivityCard({
  data,
  className,
}: {
  data: GROUP_ACTIVITY_SCHEMA;
  className?: string;
}) {
  const {
    groupID,
    activityTitle,
    activityID,
    activityDesc,
    activityDate: tempTimestamp,
    isPT,
  } = data;

  const tempDate = new Date(tempTimestamp.seconds * 1000);
  const date = DateToTimestamp(tempDate);
  const dateStr = DateToString(tempDate);
  const active = ActiveTimestamp(date);

  return (
    <Link
      scroll={false}
      className="w-full"
      href={`/groups/${groupID}/activity?${new URLSearchParams({
        id: activityID,
      })}`}
    >
      <DefaultCard
        className={twMerge(
          "w-full flex flex-col items-start justify-start duration-150 hover:bg-white/50",
          className
        )}
      >
        <div className="w-full flex items-center justify-between flex-wrap gap-x-2">
          <h1 className="text-start font-semibold text-lg text-custom-dark-text flex items-start justify-start gap-2">
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
          </h1>
          <ActivityStatusTab active={active} />
        </div>

        <p className="text-custom-dark-text text-sm">{activityDesc}</p>
        <p className="text-custom-grey-text text-xs mt-1">
          {active ? "Begins on: " : "Ended on: "}
          {dateStr}
        </p>
      </DefaultCard>
    </Link>
  );
}
