import React from "react";
import ProfileSection from "@/src/components/profile/ProfileSection";
import { redirect } from "next/navigation";
import HeaderBar from "@/src/components/navigation/HeaderBar";
import { Metadata } from "next";
import BiboSection from "@/src/components/bibo/BiboSection";

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
      <div className="grid place-items-center">
        <div className="sm:col-span-1 flex flex-col gap-4 items-stretch justify-center w-full max-w-[500px]">
          <ProfileSection />
          <BiboSection />
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
}
