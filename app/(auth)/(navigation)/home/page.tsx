import FeedSkeleton from "@/src/components/FeedSkeleton";
import AnnouncementSection from "@/src/components/announcements/AnnouncementSection";
import CreateAnnouncementForm from "@/src/components/announcements/CreateAnnouncementForm";
import MaintenanceSection from "@/src/components/announcements/MaintenanceSection";
import UpdatesSection from "@/src/components/announcements/UpdatesSection";
import ActivityFeedSkeleton from "@/src/components/feed/ActivityFeedSkeleton";
import FeedGroup from "@/src/components/feed/FeedGroup";
import GroupsScrollSection from "@/src/components/feed/GroupsScrollSection";
import HomeHeaderBar from "@/src/components/navigation/HomeHeaderBar";
import ErrorActivities from "@/src/components/screens/ErrorActivities";
import { dbHandler } from "@/src/firebase/db";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import { ROLES_HIERARCHY } from "@/src/utils/constants";

import {
  MEMBER_JOINED_GROUPS_SCHEMA,
  MEMBER_CREATED_GROUPS_SCHEMA,
  MEMBER_SCHEMA,
} from "@/src/utils/schemas/members";
import { IS_DEBUG } from "@/src/utils/settings";
import { noShowUpdate } from "@/src/utils/versions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getMemberAuthServer } from "@/src/utils/auth/handleServerAuth";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home({
  searchParams,
}: {
  searchParams: { activity: string; groupID: string };
}) {
  const { user, isAuthenticated } = await getMemberAuthServer();
  if (!isAuthenticated || user === null) return <SignInAgainScreen />;
  const { memberID } = user;

  let activityType = searchParams.activity;
  const groupID = searchParams.groupID;

  if (!activityType) {
    activityType = "announcements";
  }
  // redirect(`/home?${new URLSearchParams({ activity: "announcements" })}`);

  const host = process.env.HOST;

  if (activityType === "groups") {
    // fetch groups member is in
    const MemberObj = GetPostObj({ memberID });
    const res = await fetch(`${host}/api/groups/joined`, MemberObj);
    const body = await res.json();

    if (!body.status) return ErrorScreenHandler(body.error);

    // fetch group member created
    const resA = await fetch(`${host}/api/groups/owned`, MemberObj);
    const bodyA = await resA.json();

    if (!bodyA.status) return ErrorScreenHandler(bodyA.error);

    const joinedGroupsData = body.data as {
      [groupID: string]: MEMBER_JOINED_GROUPS_SCHEMA;
    };
    const ownedGroupsData = bodyA.data as {
      [groupID: string]: MEMBER_CREATED_GROUPS_SCHEMA;
    };

    const groupsList = Object.keys(joinedGroupsData).concat(
      Object.keys(ownedGroupsData)
    );
    if (!groupID && groupsList.length > 0)
      redirect(
        `/home?${new URLSearchParams({
          activity: "groups",
          groupID: groupsList[0],
        })}`
      );

    return (
      <>
        <HomeHeaderBar text="Social40" params={activityType} />
        <div className="w-full grid place-items-center mt-[5.5rem]">
          {groupsList.length === 0 ? (
            <ErrorActivities text="Looks like you have no groups joined." />
          ) : (
            <div className="flex flex-col w-full items-center justify-start gap-4 max-w-[500px] overflow-x-hidden">
              {groupsList.length > 1 && (
                <GroupsScrollSection groupsList={groupsList} />
              )}
              <Suspense
                key={searchParams.groupID}
                fallback={<ActivityFeedSkeleton />}
              >
                <FeedGroup memberID={memberID} groupID={searchParams.groupID} />
              </Suspense>
            </div>
          )}
        </div>
      </>
    );
  }

  try {
    const res = await dbHandler.get({
      col_name: "MEMBERS",
      id: memberID,
    });

    const memberData = res.data as MEMBER_SCHEMA;
    if (!memberData)
      throw new Error(
        "An unexpected error occurred. Try clearing your cache and try again later."
      );
    let admin = false;

    if ("role" in memberData) {
      admin =
        ROLES_HIERARCHY[memberData.role].rank >= ROLES_HIERARCHY["admin"].rank;
    }

    return (
      <>
        <HomeHeaderBar text="Social40" params={activityType} />
        <div className="w-full grid place-items-center mt-[5.5rem]">
          <div className="flex flex-col w-full items-center justify-start gap-4 max-w-[500px]">
            {IS_DEBUG.status && <MaintenanceSection />}
            {!noShowUpdate && (
              <UpdatesSection
                memberData={JSON.parse(JSON.stringify(memberData))}
              />
            )}
            {admin && <CreateAnnouncementForm memberID={memberID} />}
            <Suspense fallback={<FeedSkeleton />}>
              <AnnouncementSection curMember={memberID} />
            </Suspense>
          </div>
        </div>
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}
