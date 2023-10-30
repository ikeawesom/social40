import React from "react";
import ProfileSection, {
  FriendsListType,
} from "@/src/components/profile/ProfileSection";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import { Metadata } from "next";
import BiboSection from "@/src/components/bibo/BiboSection";
import { cookies } from "next/headers";
import { dbHandler } from "@/src/firebase/db";
import ServerErrorScreen from "@/src/components/screens/ServerErrorScreen";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import NotFoundScreen from "@/src/components/screens/NotFoundScreen";
import OfflineScreen from "@/src/components/screens/OfflineScreen";
import LoadingScreenSmall from "@/src/components/screens/LoadingScreenSmall";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { ROLES_HIERARCHY } from "@/src/utils/constants";

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
  if (data) {
    const memberID = data.value;
    try {
      const host = process.env.HOST;

      const res = await dbHandler.get({ col_name: "MEMBERS", id: memberID });

      if (!res.status) throw new Error(res.error);

      const memberData = res.data as MEMBER_SCHEMA;

      // fetch the friends list of members
      const PostObj = GetPostObj({
        memberID: memberID,
      });
      const resA = await fetch(`${host}/api/profile/friends`, PostObj);

      const data = await resA.json();

      if (!data.status) throw new Error(data.error);

      const friendsList = data.data as FriendsListType;

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
              {admin && <BiboSection memberData={memberData} />}
            </div>
            {/* TO DO */}
            {/* <StatsSection
            className="sm:col-span-2"
            activities={activitiesData}
            // medicalStatus={data.medicalStatus}
            // statistics={data.statistics}
          /> */}
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
      const error = err.message;
      if (error.includes("offline")) return <OfflineScreen />;
      if (error.includes("not found")) return <NotFoundScreen />;
      else return <ServerErrorScreen eMsg={error} />;
    }
  }
  return <LoadingScreenSmall />;
}

// if (!option)
//   redirect(`/profile?${new URLSearchParams({ option: "activity" })}`);
// else {
//   if (!OPTIONS.includes(option))
//     redirect(`/profile?${new URLSearchParams({ option: "activity" })}`);
// }

// const [friendsData, activitiesData] = await Promise.all([
// getFriendsList({ memberID }),
//   getActivitiesList({ memberID }),
// ]);
