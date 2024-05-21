import React from "react";
import ErrorScreenHandler from "../../ErrorScreenHandler";
import {
  getMonthStartAndEnd,
  getWeekStartAndEnd,
} from "@/src/utils/helpers/getCurrentDate";
import ActivityCalendarClientView from "./ActivityCalendarClientView";

export default async function ActivityCalendarServerView({
  groupID,
  view,
  all,
}: {
  groupID: string;
  view: "weekly" | "monthly";
  all?: string[] | null;
}) {
  try {
    const curDate = new Date();

    const { startDate, endDate } =
      view === "weekly"
        ? getWeekStartAndEnd(curDate)
        : getMonthStartAndEnd(curDate);

    return (
      <ActivityCalendarClientView
        dates={{ startDate, endDate }}
        view={view}
        all={all}
        groupID={groupID}
        // activities={parsed}
      />
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
