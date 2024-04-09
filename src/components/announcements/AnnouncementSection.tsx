import { dbHandler } from "@/src/firebase/db";
import React from "react";
import AnnouncementCard from "./AnnouncementCard";
import Image from "next/image";
import ErrorScreenHandler from "@/src/utils/ErrorScreenHandler";
import { handleShowAnnouncements } from "./handleShowAnnouncements";

export default async function AnnouncementSection({
  curMember,
}: {
  curMember: string;
}) {
  const { defaultPosts, pinnedPosts, error } = await handleShowAnnouncements(
    curMember
  );
  if (
    Object.keys(defaultPosts).length === 0 &&
    Object.keys(pinnedPosts).length === 0
  )
    return (
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
    );
  if (!error)
    return (
      <>
        {Object.keys(pinnedPosts).length !== 0 &&
          Object.keys(pinnedPosts).map((id: string) => {
            const simpleData = JSON.parse(JSON.stringify(pinnedPosts[id]));
            return (
              <AnnouncementCard
                key={id}
                announcementData={simpleData}
                curMember={curMember}
              />
            );
          })}
        {Object.keys(defaultPosts).length !== 0 &&
          Object.keys(defaultPosts).map((id: string) => {
            const simpleData = JSON.parse(JSON.stringify(defaultPosts[id]));
            return (
              <AnnouncementCard
                key={id}
                announcementData={simpleData}
                curMember={curMember}
              />
            );
          })}
      </>
    );

  return ErrorScreenHandler(error);
}
