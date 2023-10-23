import { useEffect, useState } from "react";

export function useMemberID() {
  const [memberID, setMemberID] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("memberID");
    if (stored) setMemberID(stored);
  }, [memberID]);

  return { memberID, setMemberID };
}
