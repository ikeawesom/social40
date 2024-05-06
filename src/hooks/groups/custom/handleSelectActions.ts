"use server";

import { dbHandler } from "@/src/firebase/db";
import handleResponses from "@/src/utils/handleResponses";

export async function handleModify(membersList: string[], data: any) {
  const arrayList = membersList.map(async (memberID: string) => {
    const res = await dbHandler.edit({
      col_name: "MEMBERS",
      id: memberID,
      data,
    });
    if (!res.status)
      return handleResponses({ status: false, error: res.error });
    return handleResponses();
  });

  const promiseArray = await Promise.all(arrayList);
  promiseArray.forEach((item: any) => {
    if (!item.status)
      return handleResponses({ status: false, error: item.error });
  });

  return handleResponses();
}
