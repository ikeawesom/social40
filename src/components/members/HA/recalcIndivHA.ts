"use server";

import { dbHandler } from "@/src/firebase/db";
import { calculateIndivHA } from "@/src/utils/HA/calculateIndivHA";
import handleResponses from "@/src/utils/helpers/handleResponses";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";

export async function recalcIndivHA(memberID: string) {
  try {
    const { data, error } = await dbHandler.get({
      col_name: "MEMBERS",
      id: memberID,
    });
    if (error) throw new Error(error);

    const memberObj = { [memberID]: data } as {
      [id: string]: MEMBER_SCHEMA;
    };

    const { error: errA } = await calculateIndivHA(memberObj);
    if (errA) throw new Error(errA);
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
