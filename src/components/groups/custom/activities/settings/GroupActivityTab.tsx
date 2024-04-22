import {
  ActiveTimestamp,
  DateToTimestamp,
  TimestampToDateString,
} from "@/src/utils/getCurrentDate";
import { GROUP_ACTIVITIES_SCHEMA } from "@/src/utils/schemas/groups";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function GroupActivityTab({
  activityData,
}: {
  activityData: GROUP_ACTIVITIES_SCHEMA;
}) {
  // const date = activityData.activityDate;
  // const active = ActiveTimestamp(date);
  // const dateStr = TimestampToDateString(date);

  const tempTimestamp = activityData.activityDate;

  const tempDate = new Date(tempTimestamp.seconds * 1000);
  // tempDate.setHours(tempDate.getHours() - 8);
  const date = DateToTimestamp(tempDate);

  const active = ActiveTimestamp(date);
  const dateStr = TimestampToDateString(date);

  return (
    <Link
      href={`/groups/${activityData.groupID}/activity?${new URLSearchParams({
        id: activityData.activityID,
      })}`}
      className="w-full py-2 px-3 flex items-start justify-center flex-col duration-200 hover:bg-custom-light-text"
    >
      <h1 className="text-custom-dark-text font-semibold flex items-center justify-start gap-1">
        {activityData.activityTitle}
        <span
          className={twMerge(
            "text-xs",
            active ? "text-custom-orange" : "text-custom-green"
          )}
        >
          ({active ? "Upcoming" : "Completed"})
        </span>
      </h1>
      <h4 className="text-custom-grey-text text-sm">
        {activityData.activityDesc}
      </h4>
      <h4 className="text-custom-grey-text text-sm">{dateStr}</h4>
    </Link>
  );
}
