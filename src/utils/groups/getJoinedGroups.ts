import { dbHandler } from "../../firebase/db";
import { MemberIDType } from "../profile/getFriendsList";
import { MEMBER_JOINED_GROUPS_SCHEMA } from "../schemas/members";

export async function getJoinedGroups({ memberID }: MemberIDType) {
  var joinedGroups = {} as MEMBER_JOINED_GROUPS_SCHEMA;
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
