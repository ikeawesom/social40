import { useEffect, useState } from "react";
import { getMemberAuthServer } from "../utils/auth/handleServerAuth";

export function useMemberID() {
  const [memberID, setMemberID] = useState("");

  useEffect(() => {
    const getMemberID = async () => {
      const { user } = await getMemberAuthServer();
      if (user !== null) {
        const { memberID: data } = user;
        setMemberID(data);
      }
    };
    if (memberID === "") getMemberID();
  }, [memberID]);

  return { memberID, setMemberID };
}
