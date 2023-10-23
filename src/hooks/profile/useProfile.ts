import { dbHandler } from "@/src/firebase/db";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { useEffect, useState } from "react";

export function useProfile(memberID: string) {
  const [memberDetails, setMemberDetails] = useState<MEMBER_SCHEMA | null>();

  useEffect(() => {
    const handleFetch = async (memberID: string) => {
      const res = await dbHandler.get({ col_name: "MEMBERS", id: memberID });
      if (res.status) setMemberDetails(res.data);
      else setMemberDetails(null);
    };
    if (memberID) handleFetch(memberID);
  }, [memberID]);

  return { memberDetails, setMemberDetails };
}
