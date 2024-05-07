import { GROUP_MEMBERS_SCHEMA } from "@/src/utils/schemas/groups";
import React from "react";
import Image from "next/image";
import { contentfulImageLoader } from "@/src/components/profile/edit/ProfilePicSection";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

export default function LeaderboardTab({
  member,
  isBest,
  curMember,
  className,
}: {
  member: GROUP_MEMBERS_SCHEMA;
  isBest?: boolean;
  curMember: string;
  className?: string;
}) {
  if (member !== undefined) {
    const sameMember = curMember === member.memberID;
    return (
      <div
        className={twMerge(
          "relative overflow-hidden flex items-center justify-between gap-4 bg-gradient-to-r to-transparent p-3 rounded-lg w-full duration-150",
          isBest
            ? "from-custom-orange/50 hover:brightness-105"
            : !sameMember && "from-custom-grey-text/20 hover:brightness-75",
          className
        )}
      >
        <div className="flex items-center justify-start gap-2">
          <div
            className={twMerge(
              "overflow-hidden rounded-full shadow-lg relative flex items-center justify-center",
              isBest ? "w-[70px] h-[70px]" : "w-[50px] h-[50px]"
            )}
          >
            <Image
              loader={contentfulImageLoader}
              fill
              sizes="100%"
              src={member.pfp ? member.pfp : "/icons/icon_avatar.svg"}
              alt="Profile"
              className="object-cover drop-shadow-md z-10 overflow-hidden"
            />
          </div>
          <div>
            <Link
              href={`/members/${member.memberID}`}
              className={twMerge(
                "font-bold text-lg hover:opacity-70 duration-150 flex items-center justify-start gap-1",
                sameMember && "text-custom-primary"
              )}
            >
              {member.displayName}
              {isBest && (
                <Image
                  className="drop-shadow-md brightness-105 -translate-y-1"
                  alt="Crown"
                  width={30}
                  height={30}
                  src="/icons/features/icon_crown.png"
                />
              )}
            </Link>
            <p className="text-sm text-custom-grey-text">{member.memberID}</p>
          </div>
        </div>
        <h1 className="font-bold text-xl text-custom-primary">
          {member.points}
        </h1>
        {isBest && <div className="shimmer slow" />}
      </div>
    );
  }
}
