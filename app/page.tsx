import SignoutButton from "@/src/components/utils/SignoutButton";
import { getCookies } from "next-client-cookies/server";

export default function Home() {
  const cookieStore = getCookies();
  const UID = cookieStore.get("UID");

  if (UID)
    return (
      <>
        <SignoutButton />
      </>
    );
}
