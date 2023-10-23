import { dbHandler } from "../../firebase/db";
import { MemberIDType } from "../profile/getFriendsList";
import {
  MEMBER_CREATED_GROUPS_SCHEMA,
  MEMBER_JOINED_GROUPS_SCHEMA,
} from "../schemas/members";

export type joinedGroupsType = {
  [groupID: string]: MEMBER_JOINED_GROUPS_SCHEMA;
};

export async function getJoinedGroups({ memberID }: MemberIDType) {
  var joinedGroups = {} as joinedGroupsType;
  const res = await dbHandler.get({
    col_name: "MEMBERS_JOINED-GROUPS",
    id: memberID,
  });

  if (!res.status) return joinedGroups; // no groups joined

  Object.keys(res.data).map((groupID: string) => {
    joinedGroups[groupID] = res.data[groupID];
  });

  return joinedGroups;
}
