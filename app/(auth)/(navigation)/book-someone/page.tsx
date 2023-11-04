import React from "react";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import RestrictedScreen from "@/src/components/screens/RestrictedScreen";
import BiboScanner from "@/src/components/bibo/BiboScanner";
import { ROLES_HIERARCHY } from "@/src/utils/constants";
import { cookies } from "next/headers";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { redirect } from "next/navigation";

export default async function BookSomeoneInPage() {
  const cookieStore = cookies();

  const data = cookieStore.get("memberID");

  if (data) {
    const memberID = data.value;
    const host = process.env.HOST;
    try {
      const PostObj = GetPostObj({
        memberID: memberID,
      });

      // fetch member data from server
      const res = await fetch(`${host}/api/profile/member`, PostObj);
      const data = await res.json();

      if (!data.status) throw new Error(data.error);

      const memberDetails = data.data as MEMBER_SCHEMA;
      const { role } = memberDetails;
      const aboveAdmin =
        ROLES_HIERARCHY[role].rank >= ROLES_HIERARCHY["admin"].rank;
      if (!aboveAdmin) return <RestrictedScreen />;
      return (
        <>
          <HeaderBar back text="Book Someone In" />
          <div className="flex flex-col items-center justify-start gap-4 mt-16">
            <h1 className="text-xl font-bold text-custom-dark-text text-center">
              Please put member's book in code into the scanner below.
            </h1>
            <BiboScanner memberID={memberID} />
          </div>
        </>
      );
    } catch (err: any) {
      return ErrorScreenHandler(err);
    }
  }
  redirect("/auth-error");
}
