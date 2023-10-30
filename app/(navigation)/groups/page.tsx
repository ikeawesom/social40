import React from "react";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import { cookies } from "next/headers";
import LoadingScreenSmall from "@/src/components/screens/LoadingScreenSmall";
import { dbHandler } from "@/src/firebase/db";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import NotFoundScreen from "@/src/components/screens/NotFoundScreen";
import OfflineScreen from "@/src/components/screens/OfflineScreen";
import ServerErrorScreen from "@/src/components/screens/ServerErrorScreen";
import { ROLES_HIERARCHY } from "@/src/utils/constants";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { MemberGroupsType } from "@/src/utils/groups/getJoinedGroups";
import GroupsJoinedSection from "@/src/components/groups/GroupsJoinedSection";
import { ownedGroupsType } from "@/src/utils/groups/getOwnedGroups";
import GroupsCreatedSection from "@/src/components/groups/GroupsCreatedSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Groups",
};

export default async function Groups() {
  const cookieStore = cookies();

  const data = cookieStore.get("memberID");
  const host = process.env.HOST;

  if (data) {
    const memberID = data.value;

    try {
      const res = await dbHandler.get({ col_name: "MEMBERS", id: memberID });

      if (!res.status) throw new Error(res.error);

      const memberData = res.data as MEMBER_SCHEMA;
      const { role } = memberData;
      const admin = ROLES_HIERARCHY[role] >= ROLES_HIERARCHY["admin"];

      // get joined groups
      const resA = await fetch(
        `${host}/api/groups/joined`,
        GetPostObj({ memberID })
      );
      const fetchedDataA = await resA.json();
      const joinedGroups = fetchedDataA.data as MemberGroupsType;

      var ownedGroups;
      if (admin) {
        const resB = await fetch(
          `${host}/api/groups/owned`,
          GetPostObj({ memberID })
        );
        const fetchedDataB = await resB.json();
        ownedGroups = fetchedDataB.data as ownedGroupsType;
      }
      return (
        <>
          <HeaderBar text="Groups" />
          <div className="flex flex-col gap-10 items-center justify-start w-full">
            {ownedGroups && <GroupsCreatedSection ownedGroups={ownedGroups} />}
            <GroupsJoinedSection joinedGroups={joinedGroups} />
          </div>
        </>
      );
    } catch (err: any) {
      const error = err.message;
      if (error.includes("offline")) return <OfflineScreen />;
      if (error.includes("not found")) return <NotFoundScreen />;
      else return <ServerErrorScreen eMsg={error} />;
    }
  }
  return <LoadingScreenSmall />;
}
