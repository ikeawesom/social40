import React from "react";
import ProfileSection from "@/src/components/profile/ProfileSection";
import { dbHandler } from "@/src/firebase/db";
import StatsSection from "@/src/components/profile/StatsSection";
import { redirect } from "next/navigation";
import useFetchUserDataServer from "@/src/utils/useFetchUserDataServer";
import { getFriendsList } from "@/src/utils/profile/getFriendsList";
import { getActivitiesList } from "@/src/utils/profile/getActivitiesList";
import LoadingScreen from "@/src/components/LoadingScreen";

const OPTIONS = ["activity", "stats", "statuses"];

export default async function Profile({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const option = searchParams["option"];
  const data = useFetchUserDataServer();

  if (data) {
    if (!option)
      redirect(`/profile?${new URLSearchParams({ option: "activity" })}`);
    else {
      if (!OPTIONS.includes(option))
        redirect(`/profile?${new URLSearchParams({ option: "activity" })}`);
    }

    // manage data fetching
    const memberID = data.memberID;
    const friendsData = await getFriendsList({ memberID });
    const activitiesData = await getActivitiesList({ memberID });

    return (
      <div className="grid sm:grid-cols-3 gap-4">
        <ProfileSection className="sm:col-span-1" friendsData={friendsData} />
        <StatsSection
          className="sm:col-span-2"
          activities={activitiesData}
          // medicalStatus={data.medicalStatus}
          // statistics={data.statistics}
        />
      </div>
    );
  }

  return <LoadingScreen />;
}
