"use server";

import { dbHandler } from "@/src/firebase/db";
import handleResponses from "../helpers/handleResponses";
import { getSimple } from "../helpers/parser";

export async function fetchActivitiesWeekly(
  start: Date,
  end: Date,
  groups: string[]
) {
  // start.setHours(start.getHours() + 8);
  // end.setHours(end.getHours() + 8);
  try {
    const { data, error } = await dbHandler.getSpecific({
      path: `GROUP-ACTIVITIES`,
      orderCol: "activityDate",
      ascending: false,
      field: "activityDate",
      criteria: "<=",
      value: end,
      field2: "activityDate",
      criteria2: ">=",
      value2: start,
      field3: "groupID",
      criteria3: "in",
      value3: groups,
    });
    if (error) throw new Error(error);

    console.log("=============");
    Object.keys(data).forEach((id: string) => {
      console.log(`${id}: ${new Date(data[id].activityDate.seconds * 1000)}`);
    });

    return handleResponses({ data: getSimple(data) });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
