import { dbHandler } from "../../firebase/db";
import getCurrentDate from "../helpers/getCurrentDate";
import handleResponses from "../helpers/handleResponses";
import { MEMBER_SCHEMA } from "../schemas/members";

export type OnboardGroupMemberType = {
  groupID: string;
  memberID: string;
  role?: "member" | "admin" | "owner";
};

export async function OnboardGroupMember({
  groupID,
  memberID,
  role,
}: OnboardGroupMemberType) {
  try {
    // check if member exists
    const memberStatus = await memberExists(memberID);
    if (!memberStatus.status) throw new Error(memberStatus.error);

    // check if member already in group
    const groupStatus = await memberInGroup(groupID, memberID);
    if (!groupStatus.status) throw new Error(groupStatus.error);

    // add member to group
    const memberGroupStatus = await addMemberToGroup({
      groupID,
      memberID,
      role: role ? role : "member",
    });
    if (!memberGroupStatus.status) throw new Error(memberGroupStatus.error);

    // remove member from waitlist
    const memberWaitlist = await removeMemberWaitlist({ groupID, memberID });
    if (!memberWaitlist.status) throw new Error(memberWaitlist.error);

    // add group to member join
    const groupMemberStatus = await addGroupToMember({ groupID, memberID });
    if (!groupMemberStatus.status) throw new Error(groupMemberStatus.error);

    return handleResponses();
  } catch (err: any) {
    return handleResponses({ error: err.message, status: false });
  }
}

export async function removeMemberWaitlist({
  groupID,
  memberID,
}: OnboardGroupMemberType) {
  try {
    const res = await dbHandler.delete({
      col_name: `GROUPS/${groupID}/WAITLIST`,
      id: memberID,
    });

    if (!res.status) throw new Error(res.error);
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ error: err.message, status: false });
  }
}

export async function addGroupToMember({
  groupID,
  memberID,
}: OnboardGroupMemberType) {
  try {
    // assign new group
    const to_add = {
      dateJoined: getCurrentDate(),
      groupID: groupID,
    };

    const resA = await dbHandler.add({
      col_name: `MEMBERS/${memberID}/GROUPS-JOINED`,
      id: groupID,
      to_add: to_add,
    });

    if (!resA.status) throw new Error(resA.error);

    return handleResponses();
  } catch (err: any) {
    return handleResponses({ error: err.message, status: false });
  }
}
export async function addMemberToGroup({
  groupID,
  memberID,
  role,
}: OnboardGroupMemberType) {
  if (groupID && memberID && role) {
    try {
      const resA = await dbHandler.get({
        col_name: "MEMBERS",
        id: memberID,
      });
      if (!resA.status) throw new Error("MemberID does not exist");
      const newMemberData = resA.data as MEMBER_SCHEMA;
      const { displayName } = newMemberData;
      const to_add = {
        dateJoined: getCurrentDate(),
        memberID: memberID,
        role: role,
        displayName,
      };

      const res = await dbHandler.add({
        col_name: `GROUPS/${groupID}/MEMBERS`,
        id: memberID,
        to_add: to_add,
      });

      if (!res.status) throw new Error(res.error);

      return handleResponses();
    } catch (err: any) {
      return handleResponses({ error: err.message, status: false });
    }
  }
  return handleResponses({
    error: "GroupID, MemberID or Role not provided!",
    status: false,
  });
}

export async function memberInGroup(groupID: string, memberID: string) {
  try {
    const res = await dbHandler.get({
      col_name: "GROUPS",
      id: groupID,
    });

    if (!res.status)
      throw new Error(
        "Group not found. Please check your Group ID and try again."
      );

    const resA = await dbHandler.get({
      col_name: `GROUPS/${groupID}/MEMBERS`,
      id: memberID,
    });

    if (resA.data)
      throw new Error(
        `${memberID} is already a member of the group: ${groupID}.`
      );

    return handleResponses();
  } catch (err: any) {
    return handleResponses({ error: err.message, status: false });
  }
}

export async function memberExists(memberID: string) {
  try {
    const memberStatus = await dbHandler.get({
      col_name: "MEMBERS",
      id: memberID,
    });
    if (!memberStatus.status)
      throw new Error("Member does not exist. Please sign up again.");

    return handleResponses();
  } catch (err: any) {
    return handleResponses({ error: err.message, status: false });
  }
}
