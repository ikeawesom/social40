import { dbHandler } from "@/src/firebase/db";
import { MEMBER_SCHEMA } from "../schemas/members";
import { initWaitListee } from "../schemas/waitlist";
import getCurrentDate from "../getCurrentDate";
import handleResponses from "../handleResponses";

export default async function handleSearchGroup({
  data,
  groupID,
}: {
  data: MEMBER_SCHEMA;
  groupID: string;
}) {
  try {
    const memberID = data.memberID;
    const displayName = data.displayName;

    const res = await dbHandler.get({
      col_name: "GROUP_MEMBERS",
      id: groupID,
    });

    if (!res.status) throw new Error(res.error);

    if (Object.keys(res.data).includes(memberID))
      throw new Error("You are already a member of this group.");

    const to_add = initWaitListee({
      memberID,
      groupID: groupID,
      displayName,
      dateRequested: getCurrentDate(),
    });

    await dbHandler.add({
      col_name: `/GROUPS/${groupID}/WAITLIST`,
      id: memberID,
      to_add: to_add,
    });

    return handleResponses();
  } catch (error) {
    return handleResponses({ error: error, status: false });
  }
}
