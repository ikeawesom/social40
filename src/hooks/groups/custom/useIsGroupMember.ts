import { useEffect, useState } from "react";
import { useMemberID } from "../../useMemberID";
import { dbHandler } from "@/src/firebase/db";

export function useIsGroupMember(groupID: string) {
  const { memberID } = useMemberID();
  const [valid, setValid] = useState<boolean>();

  useEffect(() => {
    const handleCheck = async () => {
      const res = await dbHandler.get({
        col_name: `GROUPS/${groupID}/MEMBERS`,
        id: memberID,
      });
      if (!res.status) return setValid(false);
      setValid(true);
    };

    if (valid === undefined && memberID !== "") handleCheck();
  }, [memberID]);

  return { valid };
}
