"use client";

import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import React, { useEffect, useState } from "react";
import DefaultCard from "../../DefaultCard";
import { DAYS, MONTHS } from "@/src/utils/constants";
import {
  DateToString,
  getNextWeekStartAndEnd,
  getPreviousWeekStartAndEnd,
} from "@/src/utils/helpers/getCurrentDate";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { toast } from "sonner";
import { fetchActivitiesWeekly } from "@/src/utils/home/fetchActivitiesWeekly";
import CalendarActivityTab from "./CalendarActivityTab";
import LoadingIcon from "../../utils/LoadingIcon";

export type FullActivityType = { [id: string]: GROUP_ACTIVITY_SCHEMA };

export type DisplayDateActivityType = {
  date: string;
  activities: FullActivityType;
};
export default function ActivityCalendarClientView({
  view,
  all,
  groupID,
  dates: { curDate, endDate, startDate },
}: {
  view: "monthly" | "weekly";
  all?: string[] | null;
  groupID: string;
  dates: { curDate: Date; startDate: Date; endDate: Date };
}) {
  const [rangeDates, setRangeDates] = useState<{
    start: Date;
    end: Date;
  }>({ start: startDate, end: endDate });
  const [activities, setActivities] = useState<FullActivityType>();

  const fetchData = async () => {
    try {
      // console.log("through client:", rangeDates.start);
      const { data, error } = await fetchActivitiesWeekly(
        rangeDates.start,
        rangeDates.end,
        all ?? [groupID]
      );

      if (error) throw new Error(error);
      const actData = data as FullActivityType;
      setActivities(actData);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    setActivities(undefined);
    fetchData();
  }, [rangeDates, groupID]);

  const startDateStr = DateToString(rangeDates.start).split(" ")[0];
  const endDateStr = DateToString(rangeDates.end).split(" ")[0];

  const handleShiftBack = async () => {
    const { endDate, startDate } = getPreviousWeekStartAndEnd(rangeDates.start);
    setRangeDates({ start: startDate, end: endDate });
  };
  const handleShiftForward = () => {
    const { endDate, startDate } = getNextWeekStartAndEnd(rangeDates.start);
    setRangeDates({ start: startDate, end: endDate });
  };

  return (
    <>
      <DefaultCard className="w-full relative">
        {!activities && (
          <div className="absolute top-0 left-0 w-full h-full bg-white/70 grid place-items-center">
            <LoadingIcon height={50} width={50} />
          </div>
        )}
        <div className="w-full flex items-center justify-between">
          <Image
            alt="Before"
            src="/icons/icon_arrow-down.svg"
            width={25}
            height={25}
            className="rotate-90 cursor-pointer hover:opacity-70 duration-150"
            onClick={handleShiftBack}
          />
          <h1 className="font-bold text-center text-custom-dark-text fade-in-bottom">
            {view === "monthly"
              ? MONTHS[curDate.getMonth()]
              : `${startDateStr} - ${endDateStr}`}
          </h1>
          <Image
            alt="Before"
            src="/icons/icon_arrow-down.svg"
            width={25}
            height={25}
            className="-rotate-90 cursor-pointer hover:opacity-70 duration-150"
            onClick={handleShiftForward}
          />
        </div>
        {/* <HRow className="mb-3" /> */}
        <table className="mt-3 w-full">
          <tbody>
            <tr>
              <th colSpan={1} className="pl-2 text-start min-w-fit">
                Days
              </th>
              <th colSpan={1} className="text-start">
                Activities
              </th>
            </tr>
            {DAYS.map((day: string, index: number) => {
              let curDate = new Date(rangeDates.start.getTime());
              curDate.setDate(curDate.getDate() + index);
              const dateStr = DateToString(curDate).split(" ")[0];
              let todayStr = DateToString(new Date()).split(" ")[0];
              const sameDay = dateStr === todayStr;
              return (
                <tr
                  key={index}
                  className={twMerge(
                    "w-full px-2 py-3 border-b-[1px] border-t-[1px] border-custom-light-text",
                    sameDay && "bg-custom-light-orange"
                  )}
                >
                  <td valign="top" className="pl-2 py-2">
                    <div className="flex gap-1 text-sm pr-3">
                      <p className="font-bold">
                        {rangeDates.start.getDate() + index}
                      </p>
                      <p>{day}</p>
                    </div>
                  </td>
                  <td valign="top" className="py-2 w-full">
                    <CalendarActivityTab
                      index={index}
                      dateStr={dateStr}
                      activities={activities ?? undefined}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </DefaultCard>
    </>
  );
}
