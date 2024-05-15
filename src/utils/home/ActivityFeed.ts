"use server";

import { dbHandler } from "@/src/firebase/db";
import handleResponses from "../handleResponses";

export async function FetchPaginateActivity({
  groupID,
  lastPointer,
}: {
  groupID: string;
  lastPointer: any;
}) {
  try {
    let pointerRef = null;

    if (lastPointer) {
      const { error, data } = await dbHandler.getRef({
        col_name: `GROUPS/${groupID}/GROUP-ACTIVITIES`,
        id: lastPointer,
      });
      if (!error) pointerRef = data;
    }

    const { data: paginateRes, error: pagiErr } = await dbHandler.getPaginate({
      path: `GROUPS/${groupID}/GROUP-ACTIVITIES`,
      orderCol: "activityDate",
      ascending: false,
      limitNo: 5,
      queryNext: pointerRef,
    });

    if (pagiErr) throw new Error(pagiErr);

    const { data: limitedData, lastPointer: pointer } = paginateRes;

    return handleResponses({
      data: {
        data: JSON.parse(JSON.stringify(limitedData)),
        lastPointer: pointer,
      },
    });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
