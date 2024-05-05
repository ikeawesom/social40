"use server";

import { dbHandler } from "@/src/firebase/db";
import handleResponses from "../handleResponses";

export async function setDismissUpdate(
  id: string,
  version: string,
  dismissed: string[]
) {
  try {
    const { error } = await dbHandler.edit({
      col_name: "MEMBERS",
      id,
      data: {
        dismissedUpdates: [...dismissed, version],
      },
    });
    if (error) throw new Error(error);
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
