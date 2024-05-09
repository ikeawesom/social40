import DefaultCard from "@/src/components/DefaultCard";
import { GROUP_MEMBERS_SCHEMA } from "@/src/utils/schemas/groups";
import React from "react";
import Image from "next/image";
import { contentfulImageLoader } from "@/src/components/profile/edit/ProfilePicSection";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

export default function LeaderboardMember({
  member,
  curMember,
}: {
  member: GROUP_MEMBERS_SCHEMA;
  curMember: string;
}) {
  const { displayName, memberID, pfp, points } = member;
  return (
    <DefaultCard
      className={twMerge(
        "w-full flex items-center justify-between gap-3 py-2",
        curMember === memberID && "bg-custom-light-orange"
      )}
    >
      <div className="justify-start gap-3 w-full flex items-center">
        <div className="overflow-hidden rounded-full shadow-lg relative flex items-center justify-center h-[40px] w-[40px]">
          <Image
            loader={contentfulImageLoader}
            fill
            sizes="100%"
            src={pfp ? pfp : "/icons/icon_avatar.svg"}
            alt="Profile"
            className="object-cover drop-shadow-md z-10 overflow-hidden"
          />
        </div>
        <div>
          <Link
            href={`/members/${memberID}`}
            className="font-bold hover:text-custom-primary duration-150"
          >
            {displayName}
          </Link>
          <p className="text-sm text-custom-grey-text">{memberID}</p>
        </div>
      </div>
      <h1 className="text-lg font-bold text-custom-dark-text">{points}</h1>
    </DefaultCard>
  );
}
