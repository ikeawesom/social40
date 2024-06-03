import DefaultCard from "@/src/components/DefaultCard";
import ActivityRemarkData from "@/src/components/groups/custom/activities/ActivityRemarkData";
import CreateGroupActivityForm from "@/src/components/groups/custom/activities/settings/create/CreateGroupActivityForm";
import GroupActivityData from "@/src/components/groups/custom/activities/settings/GroupActivityData";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import RestrictedScreen from "@/src/components/screens/RestrictedScreen";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import { ROLES_HIERARCHY } from "@/src/utils/constants";
import React from "react";
import PageCenterWrapper from "@/src/components/utils/PageCenterWrapper";
import { dbHandler } from "@/src/firebase/db";
import { getMemberAuthServer } from "@/src/utils/auth/handleServerAuth";

export default async function ActivityPage({
  params,
  searchParams,
}: {
  params: { groupID: string };
  searchParams: { [key: string]: string };
}) {
  const { user, isAuthenticated } = await getMemberAuthServer();
  if (!isAuthenticated || user === null) return;
  const { memberID } = user;
  const groupID = params.groupID;
  const query = searchParams;

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

    const { data, error } = await dbHandler.get({
      col_name: `GROUPS/${groupID}/MEMBERS`,
      id: memberID,
    });
    // const body = await res.json();

    let admin = false;
    if (data) {
      const role = data.role;
      admin = ROLES_HIERARCHY[role].rank >= ROLES_HIERARCHY["memberPlus"].rank;
    }

    // only group owners can create new activities

    if (!admin || error) return <RestrictedScreen />;

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
              <CreateGroupActivityForm memberID={memberID} groupID={groupID} />
            </DefaultCard>
          )}
        </PageCenterWrapper>
      </>
    );
  } catch (err) {
    return ErrorScreenHandler(err);
  }
}
