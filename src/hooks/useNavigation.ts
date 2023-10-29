import { useEffect, useState } from "react";

export default function useNavigation() {
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    if (pathname === "") setPathname(window.location.pathname);
  }, [pathname]);

  return { pathname, setPathname };
}
