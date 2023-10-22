import { getCookies } from "next-client-cookies/server";
import { MEMBER_SCHEMA } from "./schemas/members";

export default function fetchUserDataServer() {
  const cookieStore = getCookies();
  const dataString = cookieStore.get("USER_DATA");
  if (dataString) return JSON.parse(dataString) as any as MEMBER_SCHEMA;
  return null;
}
