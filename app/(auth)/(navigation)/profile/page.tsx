import React from "react";
import ProfileSection, {
  FriendsListType,
} from "@/src/components/profile/ProfileSection";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import { Metadata } from "next";
import BiboSection from "@/src/components/bibo/BiboSection";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { ROLES_HIERARCHY } from "@/src/utils/constants";
import ErrorScreenHandler from "@/src/components/ErrorScreenHandler";
import StatsSection, {
  StatusListType,
} from "@/src/components/profile/StatsSection";
import { redirect } from "next/navigation";
import { getMemberAuthServer } from "@/src/utils/auth/handleServerAuth";

export const metadata: Metadata = {
  title: "Profile",
};

const OPTIONS = ["activity", "stats", "statuses"];

export default async function Profile({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const { user, isAuthenticated } = await getMemberAuthServer();
  if (!isAuthenticated || user === null) return;
  const { memberID } = user;
  const host = process.env.HOST;

  const option = searchParams["option"];
  const DEFAULT_TAB = "statuses";

  if (!option)
    redirect(`/profile?${new URLSearchParams({ option: DEFAULT_TAB })}`);
  else {
    if (!OPTIONS.includes(option))
      redirect(`/profile?${new URLSearchParams({ option: DEFAULT_TAB })}`);
  }

  try {
    const PostObj = GetPostObj({
      memberID,
    });
    // fetch member data from server
    const res = await fetch(`${host}/api/profile/member`, PostObj);
    const data = await res.json();

    if (!data.status) throw new Error(data.error);

    const memberData = data.data as MEMBER_SCHEMA;

    // fetch the friends list of members from server

    const resA = await fetch(`${host}/api/profile/friends`, PostObj);
    const dataA = await resA.json();

    if (!dataA.status) throw new Error(dataA.error);

    const friendsList = dataA.data as FriendsListType;

    // fetch member status
    const resB = await fetch(`${host}/api/profile/status`, PostObj);
    const dataB = await resB.json();

    if (!dataB.status) throw new Error(dataB.error);

    const statusList = dataB.data as StatusListType;
    // admin extra settings
    const { role } = memberData;
    const cos = ROLES_HIERARCHY[role].rank >= ROLES_HIERARCHY["cos"].rank;

    return (
      <>
        <HeaderBar text="My Profile" />
        <div className="grid place-items-center">
          <div className="sm:col-span-1 flex flex-col gap-4 items-stretch justify-center w-full max-w-[500px]">
            <ProfileSection friendsData={friendsList} memberData={memberData} />
            {/* <Suspense fallback={<DefaultSkeleton className="h-[30vh]" />}> */}
            <StatsSection
              className="sm:col-span-2"
              option={option}
              memberID={memberID}
            />
            {/* </Suspense> */}
            {cos && <BiboSection />}
            {/* <GuidebookDownload /> */}
          </div>
          {/* TO DO */}
        </div>

        {/*
       ---------- WHEN ACTIVITES ARE IMPLEMENTED, SPLIT THE COLUMNS -----------
      <div className="grid sm:grid-cols-1 gap-4">
        <div className="sm:col-span-1 flex flex-col gap-4 items-stretch justify-center">
          <ProfileSection />
          <BiboSection /> */}
      </>
    );
  } catch (err: any) {
    return ErrorScreenHandler(err);
  }
}

// const [friendsData, activitiesData] = await Promise.all([
//   getFriendsList({ memberID }),
//   getActivitiesList({ memberID }),
// ]);
