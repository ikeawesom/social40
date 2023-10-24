import { getJoinedGroups } from "@/src/utils/groups/getJoinedGroups";
import { useEffect, useState } from "react";
import { useMemberID } from "../useMemberID";
import { MEMBER_JOINED_GROUPS_SCHEMA } from "@/src/utils/schemas/members";

export function useJoinedGroups() {
  const { memberID } = useMemberID();
  const [joinedGroups, setJoinedGroups] =
    useState<MEMBER_JOINED_GROUPS_SCHEMA>();

  useEffect(() => {
    const handleFetch = async (memberID: string) => {
      const res = await getJoinedGroups({ memberID });
      setJoinedGroups(res);
    };

    if (memberID !== "") handleFetch(memberID);
  }, [memberID]);

  return { joinedGroups, setJoinedGroups };
}
