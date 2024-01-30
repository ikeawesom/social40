import FeedSkeleton from "@/src/components/FeedSkeleton";
import FeedGroup from "@/src/components/feed/FeedGroup";
import GroupsScrollSection from "@/src/components/feed/GroupsScrollSection";
import HomeHeaderBar from "@/src/components/navigation/HomeHeaderBar";
import ErrorActivities from "@/src/components/screens/ErrorActivities";
import LoadingScreenSmall from "@/src/components/screens/LoadingScreenSmall";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import ComingSoonIcon from "@/src/components/utils/ComingSoonIcon";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import {
  MEMBER_JOINED_GROUPS_SCHEMA,
  MEMBER_CREATED_GROUPS_SCHEMA,
} from "@/src/utils/schemas/members";
import { Metadata } from "next";
import { cookies } from "next/headers";
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
    redirect(`/home?${new URLSearchParams({ activity: "groups" })}`);

  const cookieStore = cookies();
  const data = cookieStore.get("memberID");
  const host = process.env.HOST;

  if (data) {
    const memberID = data.value;

    // fetch groups member is in
    const MemberObj = GetPostObj({ memberID });
    const res = await fetch(`${host}/api/groups/joined`, MemberObj);
    const body = await res.json();

    if (!body.status) throw new Error(body.error);

    // fetch group member created
    const resA = await fetch(`${host}/api/groups/owned`, MemberObj);
    const bodyA = await resA.json();

    if (!bodyA.status) throw new Error(bodyA.error);

    const joinedGroupsData = body.data as {
      [groupID: string]: MEMBER_JOINED_GROUPS_SCHEMA;
    };
    const ownedGroupsData = bodyA.data as {
      [groupID: string]: MEMBER_CREATED_GROUPS_SCHEMA;
    };

    const groupsList = Object.keys(joinedGroupsData).concat(
      Object.keys(ownedGroupsData)
    );

    if (activityType === "groups" && !groupID && groupsList.length > 0)
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
          {activityType === "groups" ? (
            groupsList.length === 0 ? (
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
            )
          ) : (
            <ComingSoonIcon className="gap-2 mt-28" />
            // <FeedFriends memberID={memberID}/>
          )}
        </div>
      </>
    );
  }
  return <LoadingScreenSmall />;
}
// {groupsList.length !== 1 && (
//                     <>

//                     </>
//                   )}
