import { dbHandler } from "@/src/firebase/db";
import { ANNOUNCEMENT_SCHEMA } from "@/src/utils/schemas/announcements";
import React from "react";
import AnnouncementCard from "./AnnouncementCard";
import Image from "next/image";

export default async function AnnouncementSection({
  curMember,
}: {
  curMember: string;
}) {
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
            curMember={curMember}
          />
        ))
      )}
    </>
  );
}
