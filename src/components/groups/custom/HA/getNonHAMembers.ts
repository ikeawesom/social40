"use server";

import { dbHandler } from "@/src/firebase/db";
import handleResponses from "@/src/utils/handleResponses";
import { DailyHAType } from "@/src/utils/schemas/ha";

export async function getNonHAMembers(members: string[]) {
  try {
    const promArr = members.map(async (id: string) => {
      const { data, error } = await dbHandler.get({ col_name: "HA", id });
      if (error) return handleResponses({ status: false, error });
      return handleResponses({ data });
    });
    const resolvedArr = await Promise.all(promArr);

    const membersIDs = [] as string[];
    const NonHAMembers = {} as { [id: string]: DailyHAType };
    resolvedArr.forEach((item: any) => {
      if (item.error) throw new Error(item.error);
      const memberData = item.data as DailyHAType;
      const { memberID, isHA } = memberData;
      membersIDs.push(memberID);

      if (!isHA) NonHAMembers[memberID] = memberData;
    });
    return handleResponses({ data: JSON.parse(JSON.stringify(NonHAMembers)) });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
