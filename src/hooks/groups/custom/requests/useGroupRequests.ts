"use client";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { WAITLIST_SCHEMA } from "@/src/utils/schemas/waitlist";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export type WaitListData = {
  [memberID: string]: WAITLIST_SCHEMA;
};

export function useGroupRequests(groupID: string) {
  const router = useRouter();
  const { host } = useHostname();
  const [requested, setRequested] = useState<WaitListData | null>();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      router.refresh();
      setSuccess(false);
      setRequested(undefined);
    }
  }, [success]);

  useEffect(() => {
    const handleFetch = async (groupID: string) => {
      const res = await fetch(
        `${host}/api/groups/waitlist`,
        GetPostObj({ sub: "get", groupID })
      );
      const fetchedData = await res.json();
      if (!fetchedData.status) return setRequested(null);

      const { data } = fetchedData;
      setRequested(data);
    };

    if (requested === undefined) handleFetch(groupID);
  }, [groupID, requested]);

  return { requested, setSuccess };
}
