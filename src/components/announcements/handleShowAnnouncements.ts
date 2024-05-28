import { dbHandler } from "@/src/firebase/db";
import { ANNOUNCEMENT_SCHEMA } from "@/src/utils/schemas/announcements";

type PostType = { [announcementID: string]: ANNOUNCEMENT_SCHEMA };

function checkValid(arr: string[], arr2: string[]) {
  return arr2.some((item) => arr.includes(item));
}

export async function handleShowAnnouncements(curMember: string) {
  const { data: groupsJoined }: { data: string[] } = await dbHandler.getDocs({
    col_name: `MEMBERS/${curMember}/GROUPS-JOINED`,
  });

  const { data: groupsCreated }: { data: string[] } = await dbHandler.getDocs({
    col_name: `MEMBERS/${curMember}/GROUPS-CREATED`,
  });

  let totalGroupsID = [] as string[];
  const totalGroupsData = groupsJoined.concat(groupsCreated);
  totalGroupsData.forEach((item: any) => {
    const data = item.data();
    totalGroupsID.push(data["groupID"]);
  });

  const { data, error } = await dbHandler.getSpecific({
    path: "ANNOUNCEMENTS",
    orderCol: "createdOn",
    ascending: false,
  });

  const allPosts = data as PostType;

  // filter according to groups involved in
  const involvedGroupsPostsID = Object.keys(allPosts).filter(
    (id: string) =>
      allPosts[id].groups === undefined ||
      allPosts[id].groups?.length === 0 ||
      checkValid(allPosts[id].groups ?? [], totalGroupsID) ||
      allPosts[id].createdBy === curMember
  );

  // filter according to pinned
  const defaultPostsID = involvedGroupsPostsID.filter(
    (id: string) => allPosts[id].pin === false
  );
  const pinnedPostsID = involvedGroupsPostsID.filter(
    (id: string) => allPosts[id].pin === true
  );

  let defaultPosts = {} as PostType;
  let pinnedPosts = {} as PostType;
  defaultPostsID.forEach((id: string) => {
    defaultPosts[id] = allPosts[id];
  });
  pinnedPostsID.forEach((id: string) => {
    pinnedPosts[id] = allPosts[id];
  });

  return { defaultPosts, pinnedPosts, error };
}
