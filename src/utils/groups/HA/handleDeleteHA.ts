"use server";

import { dbHandler } from "@/src/firebase/db";
import handleResponses from "../../helpers/handleResponses";

export async function deleteHA(reportID: string, groupID: string) {
  try {
    const { error } = await dbHandler.delete({
      col_name: `GROUPS/${groupID}/HA-REPORTS`,
      id: reportID,
    });
    if (error) throw new Error(error);
    return handleResponses();
  } catch (err: any) {
    return handleResponses({
      status: false,
      error: JSON.parse(JSON.stringify(err)),
    });
  }
}
