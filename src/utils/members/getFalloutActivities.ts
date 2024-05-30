"use server";

import { dbHandler } from "@/src/firebase/db";
import handleResponses from "../helpers/handleResponses";
import { FALLOUTS_SCHEMA } from "../schemas/activities";
import { viewFalloutsType } from "@/src/components/profile/activities/ViewFalloutsModal";
import { getSimple } from "../helpers/parser";

export async function getFalloutActivities({
  activitiesFellout,
}: {
  activitiesFellout: FALLOUTS_SCHEMA[];
}) {
  try {
    const promArr = activitiesFellout.map(
      async (falloutData: FALLOUTS_SCHEMA) => {
        const { activityID, reason } = falloutData;
        const { data, error } = await dbHandler.get({
          col_name: "GROUP-ACTIVITIES",
          id: activityID,
        });
        if (error) return handleResponses({ status: false, error });
        const to_send = { reason, ...data } as viewFalloutsType;
        return handleResponses({ data: to_send });
      }
    );

    const resArr = await Promise.all(promArr);

    let results = [] as viewFalloutsType[];
    resArr.forEach((item: any) => {
      if (item.error) throw new Error(item.error);
      results.push(getSimple(item.data));
    });
    return handleResponses({ data: results });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
