"use client";
import { dbHandler } from "@/src/firebase/db";
import { WAITLIST_SCHEMA } from "@/src/utils/schemas/waitlist";
import { useState, useEffect } from "react";

export type WaitListData = {
  [memberID: string]: WAITLIST_SCHEMA;
};

export function useGroupRequests(groupID: string) {
  const [requested, setRequested] = useState<WaitListData | null>();

  useEffect(() => {
    const handleFetch = async (groupID: string) => {
      const res = await dbHandler.getDocs({
        col_name: `GROUPS/${groupID}/WAITLIST`,
      });
      if (!res.status) return setRequested(null);
      const waitlistArr = res.data as any;
      var obj = {} as WaitListData;
      var added = false;
      waitlistArr.forEach((doc: any) => {
        const data = doc.data() as WAITLIST_SCHEMA;
        obj[data.memberID] = data;
        if (!added) added = true;
      });

      if (added) setRequested(obj);
      else setRequested(null);
    };
    handleFetch(groupID);
  }, [groupID]);

  return { requested };
}
