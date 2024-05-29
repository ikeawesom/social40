import DefaultCard from "@/src/components/DefaultCard";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import CreateStatus from "@/src/components/status/CreateStatus";
import { getMemberAuthServer } from "@/src/utils/auth/handleServerAuth";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Create Status",
};

export default async function StatusPage() {
  const { user, isAuthenticated } = await getMemberAuthServer();
  if (!isAuthenticated || user === null) return;
  const { memberID } = user;

  return (
    <>
      <HeaderBar back text="Add Status" />
      <div className="w-full grid place-items-center">
        <div className="w-full flex flex-col items-start justify-center gap-4 max-w-[500px]">
          <DefaultCard className="w-full">
            <CreateStatus memberID={memberID} />
          </DefaultCard>
          {/* <QuickStatusLinks /> */}
        </div>
      </div>
    </>
  );
}
