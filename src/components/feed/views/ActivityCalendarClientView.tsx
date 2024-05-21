"use client";

import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import React from "react";
import DefaultCard from "../../DefaultCard";
import WeeklyCalendarView from "./weekly/WeeklyCalendarView";
import MonthlyCalendarView from "./monthly/MonthlyCalendarView";

export type FullActivityType = { [id: string]: GROUP_ACTIVITY_SCHEMA };
export type CalendarDateTypes = {
  startDate: Date;
  endDate: Date;
};
export type DisplayDateActivityType = {
  date: string;
  activities: FullActivityType;
};
export default function ActivityCalendarClientView({
  view,
  all,
  groupID,
  dates,
}: {
  view: "monthly" | "weekly";
  all?: string[] | null;
  groupID: string;
  dates: CalendarDateTypes;
}) {
  return (
    <>
      <DefaultCard className="w-full">
        {view === "weekly" ? (
          <WeeklyCalendarView dates={dates} groupID={groupID} all={all} />
        ) : (
          <MonthlyCalendarView dates={dates} groupID={groupID} all={all} />
        )}
      </DefaultCard>
    </>
  );
}
