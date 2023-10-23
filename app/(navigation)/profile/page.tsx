import React from "react";
import ProfileSection from "@/src/components/profile/ProfileSection";
import { redirect } from "next/navigation";
import HeaderBar from "@/src/components/navigation/HeaderBar";

const OPTIONS = ["activity", "stats", "statuses"];

export default async function Profile({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const option = searchParams["option"];

  if (!option)
    redirect(`/profile?${new URLSearchParams({ option: "activity" })}`);
  else {
    if (!OPTIONS.includes(option))
      redirect(`/profile?${new URLSearchParams({ option: "activity" })}`);
  }

  // const [friendsData, activitiesData] = await Promise.all([
  // getFriendsList({ memberID }),
  //   getActivitiesList({ memberID }),
  // ]);

  return (
    <>
      <HeaderBar text="My Profile" />
      <div className="grid sm:grid-cols-3 gap-4">
        <ProfileSection className="sm:col-span-1" />
        {/* TO DO */}
        {/* <StatsSection
            className="sm:col-span-2"
            activities={activitiesData}
            // medicalStatus={data.medicalStatus}
            // statistics={data.statistics}
          /> */}
      </div>
    </>
  );
}
