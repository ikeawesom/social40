import FeedSkeleton from "@/src/components/FeedSkeleton";
import AnnouncementCard from "@/src/components/announcements/AnnouncementCard";
import CreateAnnouncementForm from "@/src/components/announcements/CreateAnnouncementForm";
import FeedGroup from "@/src/components/feed/FeedGroup";
import HomeHeaderBar from "@/src/components/navigation/HomeHeaderBar";
import ErrorActivities from "@/src/components/screens/ErrorActivities";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
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

    const resA = await dbHandler.getSpecific({
      path: "ANNOUNCEMENTS",
      orderCol: "createdOn",
      ascending: false,
    });

    const announcementsData = (resA.data ?? {}) as {
      [announcementID: string]: ANNOUNCEMENT_SCHEMA;
    };

    return (
      <>
        <HomeHeaderBar text="Social40" params={activityType} />
        <div className="w-full grid place-items-center mt-[5.5rem]">
          <div className="flex flex-col w-full items-center justify-start gap-4 max-w-[500px]">
            {admin && <CreateAnnouncementForm memberID={memberID} />}
            {Object.keys(announcementsData).length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <Image
                  alt="Question"
                  width={100}
                  height={100}
                  src="/icons/icon_smile.svg"
                />
                <h1 className="text-custom-dark-text text-sm">
                  No announcements yet...
                </h1>
              </div>
            ) : (
              Object.keys(announcementsData).map((id: string) => (
                <AnnouncementCard
                  key={id}
                  announcementData={announcementsData[id]}
                  curMember={memberID}
                />
              ))
            )}
          </div>
        </div>
      </>
    );
  }
  return <SignInAgainScreen />;
}
