import React from "react";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AuthErrorPage() {
  const cookieStore = cookies();
  const data = cookieStore.get("memberID");
  if (data) redirect("/home");
  return <SignInAgainScreen />;
}
