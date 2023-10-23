import {
  getJoinedGroups,
  joinedGroupsType,
} from "@/src/utils/groups/getJoinedGroups";
import { useEffect, useState } from "react";
import { useMemberID } from "../useMemberID";

export function useJoinedGroups() {
  const { memberID } = useMemberID();
  const [joinedGroups, setJoinedGroups] = useState<joinedGroupsType>();

  useEffect(() => {
    const handleFetch = async (memberID: string) => {
      const res = await getJoinedGroups({ memberID });
      setJoinedGroups(res);
    };

    if (memberID !== "") handleFetch(memberID);
  }, [memberID]);

  return { joinedGroups, setJoinedGroups };
}
