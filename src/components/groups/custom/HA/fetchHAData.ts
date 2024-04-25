"use server";

import { dbHandler } from "@/src/firebase/db";
import handleResponses from "@/src/utils/handleResponses";

export async function fetchHAData(groupID: string, reportID: string) {
  try {
    const { data, error } = await dbHandler.get({
      col_name: `GROUPS/${groupID}/HA-REPORTS`,
      id: reportID,
    });
    if (error) throw new Error(error);
    return handleResponses({ data });
  } catch (error: any) {
    return handleResponses({ status: false, error: error.message });
  }
}
