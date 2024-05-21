"use client";

import React from "react";
import CalendarHeading from "../CalendarHeading";
import {
  CalendarViewTypes,
  useHandleCalendarView,
} from "@/src/hooks/feed/useHandleCalendarViews";
import { DAYS, MONTHS } from "@/src/utils/constants";
import { DateToString } from "@/src/utils/helpers/getCurrentDate";
import { twMerge } from "tailwind-merge";
import CalendarActivityTab from "../CalendarActivityTab";
import CalendarLoading from "../CalendarLoading";

export default function WeeklyCalendarView({
  dates,
  groupID,
  all,
}: CalendarViewTypes) {
  const { activities, rangeDates, handleWeekBack, handleWeekForward } =
    useHandleCalendarView({ dates, groupID, all });
  const [startDay, startMonth, startYear] = DateToString(rangeDates.start)
    .split(" ")[0]
    .split("/");
  const startDateMonthStr = `${startDay} $${
    MONTHS[Number(startMonth) - 1]
  } ${startYear.substring(2, 4)}`;
  const [endDay, endMonth, endYear] = DateToString(rangeDates.end)
    .split(" ")[0]
    .split("/");
  const endDateMonthStr = `${endDay} $${
    MONTHS[Number(endMonth) - 1]
  } ${endYear.substring(2, 4)}`;

  return (
    <>
      <CalendarHeading
        back={handleWeekBack}
        forward={handleWeekForward}
        text={`${startDateMonthStr} to ${endDateMonthStr}`}
      />
      <div className="w-full relative">
        {!activities && <CalendarLoading />}
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
              let tempCurDate = new Date(rangeDates.start.getTime());
              tempCurDate.setDate(tempCurDate.getDate() + index);
              const dateStr = DateToString(tempCurDate).split(" ")[0];
              let todayDate = new Date();
              let todayStr = DateToString(todayDate).split(" ")[0];
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
                      <p className="font-bold">{todayDate.getDate()}</p>
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
      </div>
    </>
  );
}
