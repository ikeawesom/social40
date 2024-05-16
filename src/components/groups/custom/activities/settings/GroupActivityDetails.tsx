import DefaultCard from "@/src/components/DefaultCard";
import HRow from "@/src/components/utils/HRow";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import {
  ActiveTimestamp,
  TimestampToDateString,
} from "@/src/utils/helpers/getCurrentDate";
import React from "react";
import { SuspenseGroupActivityFetchType } from "./GroupActivityData";
import ActivityStatusTab from "@/src/components/feed/ActivityStatusTab";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import Notice from "@/src/components/utils/Notice";

export default async function GroupActivityDetails({
  activityData,
}: SuspenseGroupActivityFetchType) {
  try {
    const active = ActiveTimestamp(activityData.activityDate);
    const { activityLevel, needsHA, isPT } = activityData;

    return (
      <DefaultCard className="w-full flex flex-col items-start justify-center gap-2">
        <div className="w-full flex flex-col items-start justify-center">
          <Link
            href={`/groups/${activityData.groupID}`}
            className="text-xs text-custom-grey-text duration-150 hover:opacity-70 mb-1"
          >
            {activityData.groupID}
          </Link>
          <div className="flex items-center justify-between gap-x-4 flex-wrap w-full">
            <h1 className="text-start font-semibold text-2xl text-custom-dark-text flex items-start justify-start gap-2">
              {activityData.activityTitle}
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
          <h4 className="text-custom-dark-text text-lg">
            {activityData.activityDesc}
          </h4>

          {activityLevel && (
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
            {TimestampToDateString(activityData.activityDate)}
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
        {needsHA && (
          <Notice noHeader status="warning">
            <span className="font-bold">IMPORTANT:</span> This activity requires
            HA
          </Notice>
        )}
      </DefaultCard>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
