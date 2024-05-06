import { dbHandler } from "@/src/firebase/db";
import { GROUP_ROLES_HEIRARCHY } from "@/src/utils/constants";
import { GroupDetailsType } from "@/src/utils/schemas/groups";

export async function getUpdatedMembers(membersList: GroupDetailsType) {
  const updatedMembers = {} as GroupDetailsType;
  const promiseArr = Object.keys(membersList).map(async (id: string) => {
    const { data, error } = await dbHandler.get({
      col_name: "MEMBERS",
      id,
    });

    if (error) return { id: null, bookedIn: null, pfp: null };
    return { id: data.memberID, bookedIn: data.bookedIn, pfp: data.pfp ?? "", course: data.isOnCourse ?? false };
  });

  const resolvedArr = await Promise.all(promiseArr);

  resolvedArr.forEach((item: any) => {
    updatedMembers[item.id] = {
      ...membersList[item.id],
      bookedIn: item.bookedIn,
      pfp: item.pfp,
      isOnCourse: item.course
    };
  });

  return updatedMembers;
}

export function sortMembersList(membersList: GroupDetailsType) {
  const temp = {} as GroupDetailsType;

  const sortedId = Object.keys(membersList).sort(
    (a, b) =>
      GROUP_ROLES_HEIRARCHY[membersList[b].role].rank -
      GROUP_ROLES_HEIRARCHY[membersList[a].role].rank
  );

  sortedId.forEach((id: string) => {
    temp[id] = membersList[id];
  });

  return temp;
}
