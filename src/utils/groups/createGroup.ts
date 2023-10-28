import { dbHandler } from "@/src/firebase/db";
import getCurrentDate from "../getCurrentDate";
import { GROUP_SCHEMA, initGroupObject } from "../schemas/groups";
import handleResponses from "../handleResponses";
import { MEMBER_CREATED_GROUPS_SCHEMA } from "../schemas/members";

export async function createGroup({
  groupName,
  groupID,
  createdBy,
  groupDesc,
  createdOn,
}: GROUP_SCHEMA) {
  try {
    const res = await dbHandler.get({
      col_name: "GROUPS",
      id: groupID,
    });

    if (res.status)
      throw new Error(
        "This Admin ID is already in use. Please try again or generate a random one."
      );

    const groupData = initGroupObject({
      groupID,
      groupName,
      groupDesc,
      createdOn,
      createdBy,
    });

    const resA = await dbHandler.add({
      col_name: "GROUPS",
      id: groupID,
      to_add: groupData,
    });

    if (!resA.status) throw new Error(resA.error);

    const memberGroupData = {
      createdOn,
      groupID,
    } as MEMBER_CREATED_GROUPS_SCHEMA;

    const resB = await dbHandler.add({
      col_name: `MEMBERS/${createdBy}/GROUPS-CREATED`,
      id: groupID,
      to_add: memberGroupData,
    });

    if (!resB.status) throw new Error(resB.error);

    return handleResponses();
  } catch (err: any) {
    return handleResponses({ error: err.message, status: false });
  }
}
