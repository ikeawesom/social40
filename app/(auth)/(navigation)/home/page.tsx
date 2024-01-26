import FeedSkeleton from "@/src/components/FeedSkeleton";
import FeedGroup from "@/src/components/feed/FeedGroup";
import HomeHeaderBar from "@/src/components/navigation/HomeHeaderBar";
import ErrorActivities from "@/src/components/screens/ErrorActivities";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import ComingSoonIcon from "@/src/components/utils/ComingSoonIcon";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import {
  MEMBER_JOINED_GROUPS_SCHEMA,
  MEMBER_CREATED_GROUPS_SCHEMA,
} from "@/src/utils/schemas/members";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { twMerge } from "tailwind-merge";

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
                  <div className="flex items-center justify-start gap-x-4 overflow-x-scroll py-2 pr-6 pl-2 w-full">
                    {groupsList.map((groupID: string) => {
                      return (
                        <Link
                          key={groupID}
                          href={`/home?${new URLSearchParams({
                            activity: "groups",
                            groupID,
                          })}`}
                          className={twMerge(
                            "self-stretch w-fit rounded-lg px-2 py-1 flex text-sm items-center justify-center text-center bg-white text-custom-dark-text shadow-md duration-150",
                            searchParams.groupID === groupID
                              ? "bg-custom-primary text-custom-light-text hover:brightness-105"
                              : "hover:bg-custom-light-text"
                          )}
                        >
                          {groupID}
                        </Link>
                      );
                    })}
                  </div>
                )}
                <Suspense fallback={<FeedSkeleton />}>
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
  return <SignInAgainScreen />;
}
// {groupsList.length !== 1 && (
//                     <>

//                     </>
//                   )}
