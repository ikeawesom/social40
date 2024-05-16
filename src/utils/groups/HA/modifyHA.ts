"use server";

import { dbHandler } from "@/src/firebase/db";
import handleResponses from "../../helpers/handleResponses";
import { AllDatesActivitiesType } from "../../schemas/ha";

export async function modifyHA(
  memberID: string,
  dailyActivities: AllDatesActivitiesType,
  isHA: boolean
) {
  try {
    const { error } = await dbHandler.edit({
      col_name: "HA",
      id: memberID,
      data: {
        dailyActivities,
        isHA,
      },
    });
    if (error) throw new Error(error);
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
