import DefaultCard from "@/src/components/DefaultCard";
import HRow from "@/src/components/utils/HRow";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import {
  ActiveTimestamp,
  DateToString,
  TimestampToDate,
  TimestampToDateString,
  handleUTC,
} from "@/src/utils/getCurrentDate";
import React from "react";
import { SuspenseGroupActivityFetchType } from "./GroupActivityData";
import ActivityStatusTab from "@/src/components/feed/ActivityStatusTab";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export default async function GroupActivityDetails({
  memberID,
  activityData,
}: SuspenseGroupActivityFetchType) {
  try {
    const date = activityData.activityDate;
    const dateStr = TimestampToDateString(date);

    // modify to manage UTC time difference
    const localTimestamp = handleUTC(date);
    const active = ActiveTimestamp(localTimestamp);

    const dateLocal = activityData.createdOn;

    // modify to manage UTC time difference
    const dateA = TimestampToDate(dateLocal);
    dateA.setHours(dateA.getHours() + 8);
    const dateStrA = DateToString(dateA);

    const { activityLevel } = activityData;

    return (
      <DefaultCard className="w-full flex flex-col items-start justify-center gap-2">
        <div className="w-full flex flex-col items-start justify-center">
          <Link
            href={`/groups/${activityData.groupID}`}
            className="text-xs text-custom-grey-text duration-200 hover:opacity-70 mb-1"
          >
            {activityData.groupID}
          </Link>
          <div className="flex items-center justify-between gap-x-4 flex-wrap w-full">
            <h1 className="text-custom-dark-text font-semibold text-2xl">
              {activityData.activityTitle}
            </h1>
            <ActivityStatusTab active={active} />
          </div>
          <h4 className="text-custom-dark-text text-lg">
            {activityData.activityDesc}
          </h4>

          {activityLevel !== undefined && (
            <h4 className="text-custom-dark-text">
              Activity Level:{" "}
              <span
                className={twMerge(
                  "font-bold",
                  activityLevel === "Light"
                    ? "text-custom-green"
                    : activityLevel === "Moderate"
                    ? "text-custom-orange"
                    : "text-custom-red"
                )}
              >
                {activityLevel.toUpperCase()}
              </span>
            </h4>
          )}
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
            Created on: {dateStrA}
          </p>
        </div>
      </DefaultCard>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
