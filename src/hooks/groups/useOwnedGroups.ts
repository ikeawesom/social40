import {
  getOwnedGroups,
  ownedGroupsType,
} from "@/src/utils/groups/getOwnedGroups";
import { useEffect, useState } from "react";
import { useMemberID } from "../useMemberID";

export function useOwnedGroups() {
  const { memberID } = useMemberID();
  const [groupsCreated, setCreatedGroups] = useState<ownedGroupsType>();

  useEffect(() => {
    const handleFetch = async (memberID: string) => {
      const res = await getOwnedGroups({ memberID });
      setCreatedGroups(res);
    };

    if (memberID !== "") handleFetch(memberID);
  }, [memberID]);

  return { groupsCreated, setCreatedGroups };
}
