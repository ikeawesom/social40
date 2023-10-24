import { dbHandler } from "../../firebase/db";
import { MemberIDType } from "../profile/getFriendsList";
import { MEMBER_JOINED_GROUPS_SCHEMA } from "../schemas/members";

export type MemberGroupsType = {
  [groupID: string]: MEMBER_JOINED_GROUPS_SCHEMA;
};

export async function getJoinedGroups({ memberID }: MemberIDType) {
  var joinedGroups = {} as MemberGroupsType;
  const res = await dbHandler.getDocs({
    col_name: `MEMBERS/${memberID}/GROUPS-JOINED`,
  });

  if (!res.status) return joinedGroups; // no groups joined

  const groupsArr = res.data as MEMBER_JOINED_GROUPS_SCHEMA[];

  groupsArr.forEach((doc: any) => {
    const item = doc.data() as MEMBER_JOINED_GROUPS_SCHEMA;
    joinedGroups[item.groupID] = item;
  });

  return joinedGroups;
}
