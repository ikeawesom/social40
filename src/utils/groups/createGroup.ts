import { dbHandler } from "@/src/firebase/db";
import {
  GROUP_MEMBERS_SCHEMA,
  GROUP_SCHEMA,
  initGroupObject,
} from "../schemas/groups";
import handleResponses from "../helpers/handleResponses";
import {
  MEMBER_CREATED_GROUPS_SCHEMA,
  MEMBER_SCHEMA,
} from "../schemas/members";

export async function createGroup({
  groupName,
  groupID,
  createdBy,
  groupDesc,
  createdOn,
  cos,
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
      cos,
    });

    const resA = await dbHandler.add({
      col_name: "GROUPS",
      id: groupID,
      to_add: groupData,
    });

    if (!resA.status) throw new Error(resA.error);

    const resD = await dbHandler.get({ col_name: "MEMBERS", id: createdBy });
    const data = resD.data as MEMBER_SCHEMA;
    const { displayName } = data;
    const groupMemberData = {
      dateJoined: createdOn,
      memberID: createdBy,
      role: "owner",
      displayName,
    } as GROUP_MEMBERS_SCHEMA;

    const resB = await dbHandler.add({
      col_name: `GROUPS/${groupID}/MEMBERS`,
      id: createdBy,
      to_add: groupMemberData,
    });

    if (!resB.status) throw new Error(resB.error);

    const memberGroupData = {
      createdOn,
      groupID,
    } as MEMBER_CREATED_GROUPS_SCHEMA;

    const resC = await dbHandler.add({
      col_name: `MEMBERS/${createdBy}/GROUPS-CREATED`,
      id: groupID,
      to_add: memberGroupData,
    });

    if (!resC.status) throw new Error(resC.error);

    return handleResponses();
  } catch (err: any) {
    return handleResponses({ error: err.message, status: false });
  }
}
