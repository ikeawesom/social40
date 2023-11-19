import DefaultCard from "@/src/components/DefaultCard";
import HRow from "@/src/components/utils/HRow";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { FetchGroupActivityData } from "@/src/utils/activities/group/FetchData";
import { TimestampToDateString } from "@/src/utils/getCurrentDate";
import React from "react";
import { SuspenseGroupActivityFetchType } from "./GroupActivityData";

export default async function GroupActivityDetails({
  groupID,
  activityID,
  memberID,
}: SuspenseGroupActivityFetchType) {
  try {
    const host = process.env.HOST as string;

    const res = await FetchGroupActivityData.getMain({
      activityID,
      groupID,
      host,
      memberID,
    });

    if (!res.status) throw new Error(res.error);

    const { activityData, active, dateStr } = res.data;

    return (
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
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
