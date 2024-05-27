import { dbHandler } from "@/src/firebase/db";
import { GROUP_ROLES_HEIRARCHY } from "../constants";
import {
  GROUP_MEMBERS_SCHEMA,
  GROUP_SCHEMA,
  GroupDetailsType,
} from "../schemas/groups";
import handleResponses from "../helpers/handleResponses";

export async function getGroups() {
  try {
    const { error, data } = await dbHandler.getSpecific({
      path: "GROUPS",
      orderCol: "groupID",
      ascending: true,
    });
    if (error) throw new Error(error);
    return handleResponses({ data });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
export async function isMemberInGroup(groupID: string, memberID: string) {
  const res = await dbHandler.get({
    col_name: `GROUPS/${groupID}/MEMBERS`,
    id: memberID,
  });
  if (!res.status) return handleResponses({ status: false });
  return handleResponses({ data: res.data });
}

export async function getGroupData(groupID: string, memberID: string) {
  try {
    // check if member is in group
    const { status, data: memberData } = await isMemberInGroup(
      groupID,
      memberID
    );
    if (!status) throw new Error("RESTRICTED");

    const currentMember = memberData as GROUP_MEMBERS_SCHEMA;
    const { role } = currentMember;
    const owner = role === "owner";
    const admin =
      GROUP_ROLES_HEIRARCHY[role].rank >= GROUP_ROLES_HEIRARCHY["admin"].rank;

    // get group data
    const { data, error } = await dbHandler.get({
      col_name: "GROUPS",
      id: groupID,
    });
    if (error) throw new Error(error);

    const groupData = data as GROUP_SCHEMA;

    return handleResponses({
      data: { groupData, admin, owner, currentMember },
    });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function getGroupMembersData(groupID: string, memberID: string) {
  try {
    const { error, data } = await dbHandler.getSpecific({
      path: `GROUPS/${groupID}/MEMBERS`,
      orderCol: "memberID",
      ascending: true,
    });
    if (error) throw new Error(error);

    const groupMembers = data as GroupDetailsType;
    return handleResponses({ data: groupMembers });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
