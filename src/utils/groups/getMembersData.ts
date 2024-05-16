"use server";

import { dbHandler } from "@/src/firebase/db";
import handleResponses from "../helpers/handleResponses";
import { MEMBER_SCHEMA } from "../schemas/members";

export async function getMembersData(membersID: string[]) {
  try {
    const promArr = membersID.map(async (id: string) => {
      const { data, error } = await dbHandler.get({ col_name: "MEMBERS", id });
      if (error) return handleResponses({ status: false, error });
      return handleResponses({ data });
    });
    const resArr = await Promise.all(promArr);

    const membersData = {} as { [id: string]: MEMBER_SCHEMA };
    resArr.forEach((item: any) => {
      if (item.error) throw new Error(item.error);
      const memberData = item.data as MEMBER_SCHEMA;
      const { memberID } = memberData;
      membersData[memberID] = memberData;
    });

    return handleResponses({ data: membersData });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
