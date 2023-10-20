import { useEffect, useState } from "react";

export default function useNavigation() {
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    if (pathname === "") setPathname(window.location.pathname);
  }, []);

  return { pathname, setPathname };
}
