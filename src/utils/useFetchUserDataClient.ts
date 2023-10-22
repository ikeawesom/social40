"use client";

import { useCookies } from "next-client-cookies";
import { MEMBER_SCHEMA } from "./schemas/members";

export default function useFetchUserDataClient() {
  const cookieStore = useCookies();
  const dataString = cookieStore.get("memberDetails");
  if (dataString) return JSON.parse(dataString) as any as MEMBER_SCHEMA;

  return null;
}
