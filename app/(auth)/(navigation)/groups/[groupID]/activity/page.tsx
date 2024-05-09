import DefaultCard from "@/src/components/DefaultCard";
import ActivityRemarkData from "@/src/components/groups/custom/activities/ActivityRemarkData";
import CreateGroupActivityForm from "@/src/components/groups/custom/activities/settings/create/CreateGroupActivityForm";
import GroupActivityData from "@/src/components/groups/custom/activities/settings/GroupActivityData";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import RestrictedScreen from "@/src/components/screens/RestrictedScreen";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { ROLES_HIERARCHY } from "@/src/utils/constants";
import { cookies } from "next/headers";
import React from "react";
import PageCenterWrapper from "@/src/components/utils/PageCenterWrapper";

export default async function ActivityPage({
  params,
  searchParams,
}: {
  params: { groupID: string };
  searchParams: { [key: string]: string };
}) {
  const groupID = params.groupID;
  const query = searchParams;
  const cookieStore = cookies();
  const data = cookieStore.get("memberID");
  const host = process.env.HOST;

  if (data) {
    const memberID = data.value;
    try {
      // handled parameter errors
      const view =
        "id" in query && query["id"] !== ""
          ? true
          : "create" in query && query["create"] === "true"
          ? false
          : null;

      if (view === null) throw new Error("Invalid parameters given.");
      const title = view ? "View Activity" : "Create Activity";

      const remark = view && "remarkid" in query && query["remarkid"] !== "";

      const groupPostObj = GetPostObj({ groupID, memberID });
      const res = await fetch(`${host}/api/groups/memberof`, groupPostObj);
      const body = await res.json();

      let admin = false;
      if (body.status) {
        const role = body.data.role;
        admin = ROLES_HIERARCHY[role].rank >= ROLES_HIERARCHY["admin"].rank;
      }

      // only group owners can create new activities
      if (!view && !admin) return <RestrictedScreen />;
      return (
        <>
          <HeaderBar back text={title} />
          <PageCenterWrapper>
            {view ? (
              remark ? (
                <ActivityRemarkData
                  remarkID={query["remarkid"]}
                  groupID={groupID}
                  activityID={query["id"]}
                />
              ) : (
                <GroupActivityData activityID={query["id"]} groupID={groupID} />
              )
            ) : (
              <DefaultCard className="w-full">
                <CreateGroupActivityForm
                  memberID={memberID}
                  groupID={groupID}
                />
              </DefaultCard>
            )}
          </PageCenterWrapper>
        </>
      );
    } catch (err) {
      return ErrorScreenHandler(err);
    }
  }
  return <SignInAgainScreen />;
}
