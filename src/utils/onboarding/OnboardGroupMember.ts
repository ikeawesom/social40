import { dbHandler } from "../../firebase/db";
import getCurrentDate from "../getCurrentDate";
import handleResponses from "../handleResponses";
import { GROUP_MEMBERS_SCHEMA } from "../schemas/groups";
import { MEMBER_JOINED_GROUPS_SCHEMA } from "../schemas/members";

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
    var memberGroups = {} as MEMBER_JOINED_GROUPS_SCHEMA;

    const res = await dbHandler.get({
      col_name: "MEMBERS_JOINED-GROUPS",
      id: memberID,
    });

    if (!res.status) {
      // member has not joined any groups
      // groups data will remain as empty: {}
    } else {
      // member has already joined groups
      memberGroups = res.data as MEMBER_JOINED_GROUPS_SCHEMA;
    }

    // assign new group
    memberGroups[groupID] = {
      dateJoined: getCurrentDate(),
      groupID: groupID,
    };

    const resA = await dbHandler.add({
      col_name: "MEMBERS_JOINED-GROUPS",
      id: memberID,
      to_add: memberGroups,
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
      const currentData = await dbHandler.get({
        col_name: "GROUP_MEMBERS",
        id: groupID,
      });
      if (!currentData.status) throw new Error(currentData.error);

      var currentMembers = currentData.data as GROUP_MEMBERS_SCHEMA;

      currentMembers[memberID] = {
        dateJoined: getCurrentDate(),
        memberID: memberID,
        role: role,
      };

      const res = await dbHandler.add({
        col_name: "GROUP_MEMBERS",
        id: groupID,
        to_add: currentMembers,
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
      col_name: "GROUP_MEMBERS",
      id: groupID,
    });

    if (!res.status)
      throw new Error(
        "Group not found. Please check your Group ID and try again."
      );

    if (Object.keys(res.data).includes(memberID))
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
