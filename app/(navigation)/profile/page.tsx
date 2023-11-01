import React from "react";
import ProfileSection, {
  FriendsListType,
} from "@/src/components/profile/ProfileSection";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import { Metadata } from "next";
import BiboSection from "@/src/components/bibo/BiboSection";
import { cookies } from "next/headers";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { ROLES_HIERARCHY } from "@/src/utils/constants";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import SignInAgainScreen from "@/src/components/screens/SignInAgainScreen";
import StatsSection, {
  StatusListType,
} from "@/src/components/profile/StatsSection";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Profile",
};

const OPTIONS = ["activity", "stats", "statuses"];

export default async function Profile({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const option = searchParams["option"];
  const cookieStore = cookies();

  const data = cookieStore.get("memberID");

  if (!option)
    redirect(`/profile?${new URLSearchParams({ option: "activity" })}`);
  else {
    if (!OPTIONS.includes(option))
      redirect(`/profile?${new URLSearchParams({ option: "activity" })}`);
  }

  if (data) {
    const memberID = data.value;
    try {
      const host = process.env.HOST;

      const PostObj = GetPostObj({
        memberID: memberID,
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
      const admin = ROLES_HIERARCHY[role] >= ROLES_HIERARCHY["admin"];

      return (
        <>
          <HeaderBar text="My Profile" />
          <div className="grid place-items-center">
            <div className="sm:col-span-1 flex flex-col gap-4 items-stretch justify-center w-full max-w-[500px]">
              <ProfileSection
                friendsData={friendsList}
                memberData={memberData}
              />
              <StatsSection
                className="sm:col-span-2"
                option={option}
                // activities={activitiesData}
                statuses={statusList}
                // statistics={data.statistics}
              />
              {admin && <BiboSection memberData={memberData} />}
            </div>
            {/* TO DO */}

            <p className="text-custom-grey-text text-center text-sm mb-6">
              v0.1.0
            </p>
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
  return <SignInAgainScreen />;
}

// const [friendsData, activitiesData] = await Promise.all([
//   getFriendsList({ memberID }),
//   getActivitiesList({ memberID }),
// ]);
