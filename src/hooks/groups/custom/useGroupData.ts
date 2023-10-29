import { dbHandler } from "@/src/firebase/db";
import { GROUP_MEMBERS_SCHEMA, GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import { useState, useEffect } from "react";
import { useMemberID } from "../../useMemberID";

export type RolesType = "member" | "admin" | "owner";

export function useGroupData(groupID: string) {
  const { memberID } = useMemberID();
  const [data, setData] = useState<GROUP_SCHEMA>();
  const [error, setError] = useState("");
  const [role, setRole] = useState<RolesType>("member");

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

  useEffect(() => {
    const handleFetch = async (groupID: string, memberID: string) => {
      try {
        const res = await dbHandler.get({
          col_name: `GROUPS/${groupID}/MEMBERS`,
          id: memberID,
        });
        if (!res.status) return setError(res.error);
        const fetched = res.data as GROUP_MEMBERS_SCHEMA;
        const roleFetched = fetched.role as RolesType;
        setRole(roleFetched);
      } catch (err: any) {
        return setError(err);
      }
    };
    if (memberID) handleFetch(groupID, memberID);
  }, [groupID, memberID]);

  return { data, error, role };
}
