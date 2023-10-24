import { dbHandler } from "@/src/firebase/db";
import { GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import { useState, useEffect } from "react";

export function useGroupData(groupID: string) {
  const [data, setData] = useState<GROUP_SCHEMA>();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleFetch = async (groupID: string) => {
      const res = await dbHandler.get({ col_name: "GROUPS", id: groupID });
      if (!res.status) setError(res.error);
      else {
        const fetched = res.data as GROUP_SCHEMA;
        setData(fetched);
      }
    };

    handleFetch(groupID);
  }, [groupID]);

  return { data, error };
}
