import { dbHandler } from "@/src/firebase/db";
import { FRIENDS_SCHEMA, MEMBER_SCHEMA } from "../schemas/members";

export type MemberIDType = {
  memberID: string;
};

export async function getFriendsList({ memberID }: MemberIDType) {
  var friendList = {} as { [key: string]: FRIENDS_SCHEMA };
  var friendsData = {} as { [key: string]: MEMBER_SCHEMA };

  const friends = await dbHandler.colExists({
    path: `MEMBERS/${memberID}/FRIENDS`,
  });

  if (!friends.status) return friendsData;

  Object.keys(friends.data).forEach((key: string) => {
    friendList[key] = friends.data[key];
  });

  const friendsID = Object.keys(friendList);

  const promises = friendsID.map(async (memberID: string) => {
    const res = await getFriendsData({ memberID });
    if (res) return { ...friendsData, [memberID]: res };
  });

  const friendsList = await Promise.all(promises);

  if (!friendsList) return friendsData;

  friendsList.forEach((memberData: any) => {
    Object.keys(memberData).forEach((memberID: string) => {
      friendsData[memberID] = memberData[memberID];
    });
  });

  return friendsData;
}

export async function getFriendsData({ memberID }: MemberIDType) {
  const res = await dbHandler.get({ col_name: `MEMBERS`, id: memberID });
  if (!res.status) return null;

  const resFormat = res.data as any as MEMBER_SCHEMA;

  return resFormat;
}
