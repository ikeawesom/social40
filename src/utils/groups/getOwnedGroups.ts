import { dbHandler } from "../../firebase/db";
import { MemberIDType } from "../profile/getFriendsList";
import { MEMBER_CREATED_GROUPS_SCHEMA } from "../schemas/members";

export type ownedGroupsType = {
  [groupID: string]: MEMBER_CREATED_GROUPS_SCHEMA;
};

export async function getOwnedGroups({ memberID }: MemberIDType) {
  var ownedGroups = {} as ownedGroupsType;
  const res = await dbHandler.get({
    col_name: "MEMBERS_CREATED-GROUPS",
    id: memberID,
  });

  if (!res.status) {
    console.log(res.error);
    return ownedGroups;
  }

  Object.keys(res.data).map((groupID: string) => {
    ownedGroups[groupID] = res.data[groupID];
  });

  return ownedGroups;
}
