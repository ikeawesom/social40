import { cookies } from "next/headers";
import { useEffect, useState } from "react";
import { useHostname } from "./useHostname";

export function useMemberID() {
  const [memberID, setMemberID] = useState("");
  const { host } = useHostname();

  useEffect(() => {
    const getMemberID = async () => {
      const res = await fetch(`${host}/api/auth/signin`);
      const fetchedData = await res.json();
      const { data } = fetchedData;
      setMemberID(data);
    };
    if (memberID === "") getMemberID();
  }, [memberID]);

  return { memberID, setMemberID };
}
