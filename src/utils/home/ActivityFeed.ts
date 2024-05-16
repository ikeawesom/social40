"use server";

import { dbHandler } from "@/src/firebase/db";
import handleResponses from "../handleResponses";
import { GROUP_ACTIVITIES_SCHEMA } from "../schemas/groups";

export async function FetchPaginateActivity({
  lastPointer,
  hidden,
  limit,
  path,
}: {
  hidden?: string[];
  lastPointer?: any;
  limit?: number;
  path: string;
}) {
  try {
    let pointerRef = null;

    if (lastPointer) {
      const { error, data } = await dbHandler.getRef({
        col_name: path,
        id: lastPointer,
      });
      if (!error) pointerRef = data;
    }

    const { data: paginateRes, error: pagiErr } = await dbHandler.getPaginate({
      path: path,
      orderCol: "activityDate",
      ascending: false,
      limitNo: limit ?? 5,
      queryNext: pointerRef,
    });

    if (pagiErr) throw new Error(pagiErr);

    const { data: limitedData, lastPointer: pointer } = paginateRes;

    // filter hidden activity IDs from all activities keys
    const actArr = [] as GROUP_ACTIVITIES_SCHEMA[];
    Object.keys(limitedData).forEach((id: string) => {
      if (!hidden?.includes(id)) actArr.push(limitedData[id]);
    });

    return handleResponses({
      data: {
        data: JSON.parse(JSON.stringify(actArr)),
        lastPointer: pointer,
      },
    });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
