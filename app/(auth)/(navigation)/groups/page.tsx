import React from "react";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { ROLES_HIERARCHY } from "@/src/utils/constants";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { MemberGroupsType } from "@/src/utils/groups/getJoinedGroups";
import GroupsJoinedSection from "@/src/components/groups/GroupsJoinedSection";
import { ownedGroupsType } from "@/src/utils/groups/getOwnedGroups";
import GroupsCreatedSection from "@/src/components/groups/GroupsCreatedSection";
import { Metadata } from "next";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import { getMemberAuthServer } from "@/src/utils/auth/handleServerAuth";

export const metadata: Metadata = {
  title: "Groups",
};

export default async function Groups() {
  const { user, isAuthenticated } = await getMemberAuthServer();
  if (!isAuthenticated || user === null) return;
  const { memberID } = user;
  const host = process.env.HOST;

  try {
    const PostObj = GetPostObj({
      memberID: memberID,
    });
    // fetch member data from server
    const res = await fetch(`${host}/api/profile/member`, PostObj);
    const data = await res.json();

    if (!data.status) throw new Error(data.error);

    const memberData = data.data as MEMBER_SCHEMA;

    const { role } = memberData;
    const admin =
      ROLES_HIERARCHY[role].rank >= ROLES_HIERARCHY["memberPlus"].rank;

    // get joined groups
    const resA = await fetch(`${host}/api/groups/joined`, PostObj);
    const fetchedDataA = await resA.json();
    const joinedGroups = fetchedDataA.data as MemberGroupsType;

    var ownedGroups;
    if (admin) {
      const resB = await fetch(`${host}/api/groups/owned`, PostObj);
      const fetchedDataB = await resB.json();
      ownedGroups = fetchedDataB.data as ownedGroupsType;
    }

    return (
      <>
        <HeaderBar text="Groups" />
        <div className="grid place-items-center">
          <div className="max-w-[500px] flex flex-col gap-10 items-center justify-start w-full">
            {ownedGroups && <GroupsCreatedSection ownedGroups={ownedGroups} />}
            <GroupsJoinedSection joinedGroups={joinedGroups} />
          </div>
        </div>
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
