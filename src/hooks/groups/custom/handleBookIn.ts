"use server";

import { GroupDetailsType } from "@/src/components/groups/custom/GroupMembers";
import { dbHandler } from "@/src/firebase/db";
import handleResponses from "@/src/utils/handleResponses";

export default async function handleBookIn(membersList: GroupDetailsType) {
  const arrayList = Object.keys(membersList).map(async (memberID: string) => {
    const res = await dbHandler.edit({
      col_name: "MEMBERS",
      id: memberID,
      data: { bookedIn: true },
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
