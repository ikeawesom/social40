import { getJoinedGroups } from "./getJoinedGroups";
import { getOwnedGroups } from "./getOwnedGroups";

export async function getInvolvedGroups(memberID: string) {
  const joinedGroups = await getJoinedGroups({ memberID });
  const ownedGroups = await getOwnedGroups({ memberID });
  const groupsList = Object.keys(joinedGroups).concat(Object.keys(ownedGroups));
  return { groupsList };
}
