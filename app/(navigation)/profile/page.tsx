import React from "react";
import { getCookies } from "next-client-cookies/server";
import ProfileSection from "@/src/components/profile/ProfileSection";
import {
  ACTIVITY_SCHEMA,
  MEDICAL_SCHEMA,
  MEMBER_SCHEMA,
  STATISTICS_SCHEMA,
} from "@/src/utils/schemas/member";
import { dbHandler } from "@/src/firebase/db";
import StatsSection from "@/src/components/profile/StatsSection";
import { redirect } from "next/navigation";

const OPTIONS = ["activity", "stats", "statuses"];

export default async function Profile({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const cookieStore = getCookies();
  const UID = cookieStore.get("UID");
  const option = searchParams["option"];

  if (UID) {
    const { status, data, error } = await dbHandler.get({
      col_name: "MEMBERS",
      id: UID,
    });

    if (!option)
      redirect(`/profile?${new URLSearchParams({ option: "activity" })}`);
    else {
      if (!OPTIONS.includes(option))
        redirect(`/profile?${new URLSearchParams({ option: "activity" })}`);
    }

    if (status) {
      const dataSchema = data as any as MEMBER_SCHEMA;

      const friendsList = dataSchema.friends;

      var friendsData = [] as FriendDisplay[];

      friendsList.forEach(async (id) => {
        const res = await dbHandler.get({ col_name: "MEMBER", id: id });
        if (res.status) {
          var data = res.data as MEMBER_SCHEMA;
          friendsData.push({
            displayName: data.displayName,
            username: data.username,
          });
        }
      });

      return (
        <div className="grid sm:grid-cols-3 gap-4">
          <ProfileSection
            className="sm:col-span-1"
            data={dataSchema}
            friendsList={friendsData}
          />
          <StatsSection
            className="sm:col-span-2"
            data={dataSchema}
            activities={dataSchema.activities}
            medicalStatus={dataSchema.medicalStatus}
            statistics={dataSchema.statistics}
          />
        </div>
      );
    }
    // user not in database
    console.log(error);
  }
}

export type FriendDisplay = {
  displayName: string;
  username: string;
};

export type DataType = {
  data: MEMBER_SCHEMA;
  className?: string;
  friendsList?: FriendDisplay[];
  activities?: ACTIVITY_SCHEMA[];
  statistics?: STATISTICS_SCHEMA[];
  medicalStatus?: MEDICAL_SCHEMA[];
};
