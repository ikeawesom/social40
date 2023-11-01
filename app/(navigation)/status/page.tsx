import HeaderBar from "@/src/components/navigation/HeaderBar";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import CreateStatus from "@/src/components/status/CreateStatus";
import { cookies } from "next/headers";
import React from "react";

export default async function StatusPage() {
  const cookieStore = cookies();

  const data = cookieStore.get("memberID");
  if (data) {
    const memberID = data.value;

    return (
      <>
        <HeaderBar back text="Add Status" />
        <CreateStatus memberID={memberID} />
      </>
    );
  }
  return <SignInAgainScreen />;
}
