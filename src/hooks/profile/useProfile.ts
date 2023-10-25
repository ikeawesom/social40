import { dbHandler } from "@/src/firebase/db";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { useEffect, useState } from "react";
import { useMemberID } from "../useMemberID";

export function useProfile() {
  const { memberID } = useMemberID();
  const [memberDetails, setMemberDetails] = useState<MEMBER_SCHEMA | null>();

  useEffect(() => {
    const handleFetch = async (memberID: string) => {
      const res = await dbHandler.get({ col_name: "MEMBERS", id: memberID });
      if (res.status) setMemberDetails(res.data);
      else setMemberDetails(null);
    };
    if (memberID !== "" && memberDetails === undefined) handleFetch(memberID);
  }, [memberID, memberDetails]);

  return { memberDetails, setMemberDetails };
}
