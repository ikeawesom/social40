import DefaultCard from "@/src/components/DefaultCard";
import CreateGroupActivityForm from "@/src/components/groups/custom/activities/CreateGroupActivityForm";
import GroupActivityData from "@/src/components/groups/custom/activities/GroupActivityData";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import RestrictedScreen from "@/src/components/screens/RestrictedScreen";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { cookies } from "next/headers";
import React from "react";

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

      const groupPostObj = GetPostObj({ groupID, memberID });
      const res = await fetch(`${host}/api/groups/memberof`, groupPostObj);
      const body = await res.json();

      let owner = false;
      if (body.status) owner = body.data.role === "owner";

      // only group owners can create new activities
      if (!view && !owner) return <RestrictedScreen />;
      return (
        <>
          <HeaderBar back text={title} />
          <div className="w-full grid place-items-center">
            {view ? (
              <GroupActivityData activityID={query["id"]} groupID={groupID} />
            ) : (
              <DefaultCard className="w-full max-w-[500px]">
                <CreateGroupActivityForm
                  memberID={memberID}
                  groupID={groupID}
                />
              </DefaultCard>
            )}
          </div>
        </>
      );
    } catch (err) {
      return ErrorScreenHandler(err);
    }
  }
  return <SignInAgainScreen />;
}