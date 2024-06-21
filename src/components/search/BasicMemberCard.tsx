import Link from "next/link";
import React from "react";
import DefaultCard from "../DefaultCard";
import { contentfulImageLoader } from "../profile/edit/ProfilePicSection";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import Image from "next/image";

export default function BasicMemberCard({ member }: { member: MEMBER_SCHEMA }) {
  const { memberID, displayName, rank, pfp } = member;
  const name = `${rank} ${displayName}`.trim();
  return (
    <Link
      href={`/members/${memberID}`}
      className="w-full text-custom-dark-text hover:opacity-70 duration-150"
    >
      <DefaultCard className="py-2 px-3">
        <div className="flex items-center justify-start gap-2">
          <div className="w-[45px] h-[45px] overflow-hidden rounded-full shadow-lg relative flex items-center justify-center">
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
            <p className="font-bold">{name}</p>
            <p className="text-xs text-custom-grey-text">{memberID}</p>
          </div>
        </div>
      </DefaultCard>
    </Link>
  );
}
