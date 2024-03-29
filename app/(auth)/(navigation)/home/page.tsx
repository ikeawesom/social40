import FeedSkeleton from "@/src/components/FeedSkeleton";
import AnnouncementSection from "@/src/components/announcements/AnnouncementSection";
import CreateAnnouncementForm from "@/src/components/announcements/CreateAnnouncementForm";
import FeedGroup from "@/src/components/feed/FeedGroup";
import GroupsScrollSection from "@/src/components/feed/GroupsScrollSection";
import HomeHeaderBar from "@/src/components/navigation/HomeHeaderBar";
import ErrorActivities from "@/src/components/screens/ErrorActivities";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import { dbHandler } from "@/src/firebase/db";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { ROLES_HIERARCHY } from "@/src/utils/constants";
import { ANNOUNCEMENT_SCHEMA } from "@/src/utils/schemas/announcements";
import {
  MEMBER_JOINED_GROUPS_SCHEMA,
  MEMBER_CREATED_GROUPS_SCHEMA,
  MEMBER_SCHEMA,
} from "@/src/utils/schemas/members";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home({
  searchParams,
}: {
  searchParams: { activity: string; groupID: string };
}) {
  const activityType = searchParams.activity;
  const groupID = searchParams.groupID;

  if (!activityType)
    redirect(`/home?${new URLSearchParams({ activity: "announcements" })}`);

  const cookieStore = cookies();
  const data = cookieStore.get("memberID");
  const host = process.env.HOST;

  if (data) {
    const memberID = data.value;

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
                  fallback={<FeedSkeleton />}
                >
                  <FeedGroup
                    memberID={memberID}
                    groupID={searchParams.groupID}
                  />
                </Suspense>
              </div>
            )}
          </div>
        </>
      );
    }

    const res = await dbHandler.get({
      col_name: "MEMBERS",
      id: memberID,
    });

    const memberData = res.data as MEMBER_SCHEMA;
    const { role } = memberData;
    const admin = ROLES_HIERARCHY[role].rank >= ROLES_HIERARCHY["admin"].rank;

    return (
      <>
        <HomeHeaderBar text="Social40" params={activityType} />
        <div className="w-full grid place-items-center mt-[5.5rem]">
          <div className="flex flex-col w-full items-center justify-start gap-4 max-w-[500px]">
            {admin && <CreateAnnouncementForm memberID={memberID} />}
            <Suspense fallback={<FeedSkeleton />}>
              <AnnouncementSection curMember={memberID} />
            </Suspense>
          </div>
        </div>
      </>
    );
  }
  return <SignInAgainScreen />;
}
