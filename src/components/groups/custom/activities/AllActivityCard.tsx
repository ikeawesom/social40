import DefaultCard from "@/src/components/DefaultCard";
import ActivityStatusTab from "@/src/components/feed/ActivityStatusTab";
import {
  ActiveTimestamp,
  TimestampToDateString,
} from "@/src/utils/getCurrentDate";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import Link from "next/link";
import React from "react";

export default function AllActivityCard({
  data,
}: {
  data: GROUP_ACTIVITY_SCHEMA;
}) {
  const { groupID, activityTitle, activityID, activityDesc, activityDate } =
    data;
  const dateStr = TimestampToDateString(activityDate);
  const active = ActiveTimestamp(activityDate);

  return (
    <DefaultCard className="w-full flex flex-col items-start justify-start">
      <div className="w-full flex items-center justify-between flex-wrap gap-x-2">
        <Link
          href={`/groups/${groupID}/activity?${new URLSearchParams({
            id: activityID,
          })}`}
          className="text-start font-semibold text-lg text-custom-dark-text duration-200 hover:opacity-70"
        >
          {activityTitle}
        </Link>
        <ActivityStatusTab active={active} />
      </div>
      <p className="text-custom-dark-text text-sm">{activityDesc}</p>
      <p className="text-custom-grey-text text-xs mt-1">
        {active ? "Begins on: " : "Ended on: "}
        {dateStr}
      </p>
    </DefaultCard>
  );
}
