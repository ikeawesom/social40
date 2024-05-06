"use server";

import { dbHandler } from "@/src/firebase/db";
import handleResponses from "@/src/utils/handleResponses";

export async function removeMembers(groupID: string, members: string[]) {
  try {
    // remove members from group
    const promiseArr = members.map(async (memberID: string) => {
      // remove directly from group
      const res = await dbHandler.delete({
        col_name: `GROUPS/${groupID}/MEMBERS`,
        id: memberID,
      });
      if (!res.status)
        return handleResponses({ status: false, error: res.error });

      // remove from member joined groups
      const resA = await dbHandler.delete({
        col_name: `MEMBERS/${memberID}/GROUPS-JOINED`,
        id: groupID,
      });
      if (!resA.status)
        return handleResponses({ status: false, error: resA.error });

      return handleResponses();
    });

    const resolvedArr = await Promise.resolve(promiseArr);

    resolvedArr.forEach((item: any) => {
      if (!item.status) throw new Error(item.error);
    });
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.messsage });
  }
}

export async function manageAdmin(
  groupID: string,
  members: string[],
  status: boolean
) {
  // make member admin

  try {
    const promiseArr = members.map(async (memberID: string) => {
      const res = await dbHandler.edit({
        col_name: `GROUPS/${groupID}/MEMBERS`,
        id: memberID,
        data: { role: status ? "admin" : "member" },
      });

      if (!res.status)
        return handleResponses({ status: false, error: res.error });
      return handleResponses({ status: true });
    });

    const resolvedArr = await Promise.resolve(promiseArr);

    resolvedArr.forEach((item: any) => {
      if (!item.status) throw new Error(item.error);
    });
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.messsage });
  }
}
