import { dbHandler } from "../../firebase/db";
import { MemberIDType } from "../profile/getFriendsList";
import { MEMBER_CREATED_GROUPS_SCHEMA } from "../schemas/members";

export type ownedGroupsType = {
  [groupID: string]: MEMBER_CREATED_GROUPS_SCHEMA;
};

export async function getOwnedGroups({ memberID }: MemberIDType) {
  var ownedGroups = {} as ownedGroupsType;
  const res = await dbHandler.getDocs({
    col_name: `MEMBERS/${memberID}/GROUPS-CREATED`,
  });

  if (!res.status) return ownedGroups; // no groups owned

  const groupsArr = res.data as any[];

  groupsArr.forEach((item: any) => {
    const data = item.data() as MEMBER_CREATED_GROUPS_SCHEMA;
    const groupID = data.groupID;
    const createdOn = data.createdOn;
    ownedGroups[groupID] = {
      groupID: groupID,
      createdOn: createdOn,
    };
  });

  return ownedGroups;
}
