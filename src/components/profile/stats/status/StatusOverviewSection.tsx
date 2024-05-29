import React from "react";
import { StatusListType } from "../../StatsSection";
import { dbHandler } from "@/src/firebase/db";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { getDateDiff } from "@/src/utils/groups/HA/handleHA";
import CircleProgess from "../../../utils/circular-progressbar/CircleProgess";
import ProfileStatSection from "../../ProfileStatSection";

export default async function StatusOverviewSection({
  statuses,
  memberID,
}: {
  statuses: StatusListType;
  memberID: string;
}) {
  const { data }: { data: MEMBER_SCHEMA } = await dbHandler.get({
    col_name: "MEMBERS",
    id: memberID,
  });
  const { createdOn } = data;
  const start = new Date(createdOn.seconds * 1000);
  const now = new Date();

  const memberAge = getDateDiff(now, start);
  const noWeekDays = getWeekdays(now, start);
  let noMCs = 0;
  let noStatus = 0;
  let totalDuration = 0;

  Object.keys(statuses).forEach((id: string) => {
    const { mc, startDate, endDate } = statuses[id];
    if (mc) {
      noMCs += 1;
      const start = new Date(startDate.seconds * 1000);
      const end = new Date(endDate.seconds * 1000);
      const statusDur = getDateDiff(end, start);
      totalDuration += statusDur;
    } else {
      noStatus += 1;
    }
  });

  const avgMonthMC = getAverage(memberAge, noMCs);
  const avgMonthStatus = getAverage(memberAge, noStatus);
  const attendancePercentage =
    Math.round((Number.EPSILON + (totalDuration / noWeekDays) * 100) * 10) / 10;

  return (
    <div className="flex items-center justify-start flex-col w-full gap-1">
      <h1 className="text-xl mb-2 font-bold text-center text-custom-dark-text">
        Overview
      </h1>
      <div className="flex items-center justify-center gap-2 flex-col">
        <div className="w-[100px] h-[100px] mb-2">
          <CircleProgess
            value={attendancePercentage}
            config={{ first: 10, second: 20 }}
          >
            <p className="text-xs max-w-[70px] text-center">Absence Rate</p>
          </CircleProgess>
        </div>
        <p className="text-xs text-custom-grey-text text-center max-w-[250px]">
          This rate is calculated based on the total number of days of MCs
          received.
        </p>
      </div>
      <div className="flex items-center justify-center gap-4 my-3 w-full">
        <ProfileStatSection
          title="MCs/month"
          config={{ first: 1, second: 3 }}
          value={avgMonthMC}
          className="flex-1"
        />
        <ProfileStatSection
          title="Statuses/month"
          config={{ first: 2, second: 5 }}
          value={avgMonthStatus}
          className="flex-1"
        />
      </div>
    </div>
  );
}

export function getAverage(
  age: number,
  value: number,
  duration?: number,
  noExtra?: boolean
) {
  const durationFinal = noExtra ? 1 : duration ?? 30;
  return Math.round((Number.EPSILON + value / (age / durationFinal)) * 10) / 10;
}

export function getWeekdays(now: Date, start: Date) {
  function isWeekend(date: Date) {
    return date.getDay() === 0 || date.getDay() === 6;
  }

  let no = 0;
  let cur = new Date(start.getTime());
  while (cur <= now) {
    no += isWeekend(cur) ? 0 : 1;
    cur.setDate(cur.getDate() + 1);
  }
  return no;
}
