import { dbHandler } from "@/src/firebase/db";

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

  console.log(totalGroupsID);

  const { data: pinnedPosts, error: pinnedError } = await dbHandler.getSpecific(
    {
      path: "ANNOUNCEMENTS",
      orderCol: "createdOn",
      ascending: false,
      field: "pin",
      criteria: "==",
      value: true,
      field2: "groups",
      criteria2: "array-contains-any",
      value2: totalGroupsID,
    }
  );

  const { data: defaultPosts, error: defaultError } =
    await dbHandler.getSpecific({
      path: "ANNOUNCEMENTS",
      orderCol: "createdOn",
      ascending: false,
      field: "pin",
      criteria: "==",
      value: false,
      field2: "groups",
      criteria2: "array-contains-any",
      value2: totalGroupsID,
    });

  return { defaultPosts, pinnedPosts, defaultError, pinnedError };
}
