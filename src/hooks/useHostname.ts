import { useState, useEffect } from "react";

export function useHostname() {
  const [host, setHost] = useState("");

  useEffect(() => {
    if (host === "") setHost(window.location.origin);
  }, [host]);

  return { host };
}
