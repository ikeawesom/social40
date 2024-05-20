import React from "react";
import ErrorScreenHandler from "../../ErrorScreenHandler";
import { dbHandler } from "@/src/firebase/db";
import {
  getMonthStartAndEnd,
  getWeekStartAndEnd,
} from "@/src/utils/helpers/getCurrentDate";
import { getSimple } from "@/src/utils/helpers/parser";
import ActivityCalendarClientView, {
  FullActivityType,
} from "./ActivityCalendarClientView";

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

    const { data, error } = await dbHandler.getSpecific({
      path: `GROUP-ACTIVITIES`,
      orderCol: "activityDate",
      ascending: false,
      field: "activityDate",
      criteria: "<=",
      value: endDate,
      field2: "activityDate",
      criteria2: ">=",
      value2: startDate,
      field3: "groupID",
      criteria3: "in",
      value3: all ?? [groupID],
    });

    if (error) throw new Error(error);

    const parsed = getSimple(data) as FullActivityType;

    return (
      <ActivityCalendarClientView
        dates={{ curDate, startDate, endDate }}
        view={view}
        activities={parsed}
      />
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
