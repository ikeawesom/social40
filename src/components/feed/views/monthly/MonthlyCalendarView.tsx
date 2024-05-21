"use client";
import {
  CalendarViewTypes,
  useHandleCalendarView,
} from "@/src/hooks/feed/useHandleCalendarViews";
import React from "react";
import CalendarHeading from "../CalendarHeading";
import CalendarLoading from "../CalendarLoading";
import { DAYS, MONTHS } from "@/src/utils/constants";
import { DateToActivityType } from "@/src/utils/home/activitiesToDates";
import { DateToString } from "@/src/utils/helpers/getCurrentDate";
import CalendarActivityTab from "../CalendarActivityTab";

export default function MonthlyCalendarView({
  dates,
  groupID,
  all,
}: CalendarViewTypes) {
  const { activities, rangeDates, handleMonthBack, handleMonthForward } =
    useHandleCalendarView({
      dates,
      groupID,
      all,
    });
  const { start, end } = rangeDates;

  const startDay = start.getDay();

  const firstDate = new Date(start.getTime());
  firstDate.setDate(firstDate.getDate() - startDay);

  const finalDate = new Date(end.getTime());
  finalDate.setDate(finalDate.getDate() + (6 - end.getDay()));

  console.log("finalDate:", finalDate);
  let curDate = new Date(firstDate.getTime());
  const to_append = {} as DateToActivityType;

  while (curDate.getTime() < finalDate.getTime()) {
    const dateStr = DateToString(curDate).split(" ")[0];
    to_append[dateStr] = {};
    curDate.setDate(curDate.getDate() + 1);
  }

  return (
    <>
      <CalendarHeading
        back={handleMonthBack}
        forward={handleMonthForward}
        text={`${
          MONTHS[rangeDates.start.getMonth()]
        } ${rangeDates.start.getFullYear()}`}
      />
      <div className="w-full relative">
        {!activities && <CalendarLoading />}
        <div className="grid grid-rows-1 grid-cols-7 rounded-md overflow-hidden mb-1 mt-2">
          {DAYS.map((day: string, index: number) => (
            <div className="grid w-full place-items-center text-sm" key={index}>
              {day.substring(0, 1)}
            </div>
          ))}
        </div>
        <div className="grid grid-rows-5 grid-cols-7 rounded-md overflow-hidden min-h-[35vh]">
          {Object.keys(to_append).map((dateStr: string, index: number) => {
            const diffMonth =
              Number(dateStr.split("/")[1]) !== start.getMonth() + 1;
            return (
              <CalendarActivityTab
                key={index}
                isMonth={{ diffMonth, state: true }}
                index={index}
                dateStr={dateStr}
                activities={activities ?? undefined}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
