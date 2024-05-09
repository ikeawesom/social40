import { GROUP_MEMBERS_SCHEMA } from "@/src/utils/schemas/groups";
import React from "react";
import Image from "next/image";
import { contentfulImageLoader } from "@/src/components/profile/edit/ProfilePicSection";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { PodiumType } from "@/src/utils/constants";

export default function LeaderboardTab({
  member,
  type,
  curMember,
  className,
}: {
  member: GROUP_MEMBERS_SCHEMA;
  type: PodiumType;
  curMember: string;
  className?: string;
}) {
  if (member !== undefined) {
    const sameMember = curMember === member.memberID;
    return (
      <div
        className={twMerge(
          "relative overflow-hidden flex items-center justify-between gap-4 bg-gradient-to-r to-transparent p-3 rounded-lg w-full duration-150",
          type === "GOLD"
            ? "from-custom-orange/50 hover:brightness-105"
            : type === "SILVER"
            ? "from-gray-200"
            : type === "BRONZE"
            ? "from-[#d3795d]"
            : !sameMember
            ? "from-custom-grey-text/20 hover:brightness-75"
            : "bg-white",
          className
        )}
      >
        <div className="flex items-center justify-start gap-2">
          <div
            className={twMerge(
              "overflow-hidden rounded-full shadow-lg relative flex items-center justify-center",
              type === "GOLD" ? "w-[70px] h-[70px]" : "w-[45px] h-[45px]"
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
                "font-bold hover:opacity-70 duration-150 flex items-center justify-start gap-1",
                sameMember && "text-custom-primary",
                type === "GOLD" ? "text-lg" : "text-base"
              )}
            >
              {member.displayName}
              {type === "GOLD" && (
                <Image
                  className="drop-shadow-md brightness-105 -translate-y-1"
                  alt="Crown"
                  width={30}
                  height={30}
                  src="/icons/features/icon_crown.png"
                />
              )}
            </Link>
            <p
              className={twMerge(
                "text-custom-grey-text",
                type === "GOLD" ? "text-sm" : "text-xs"
              )}
            >
              {member.memberID}
            </p>
          </div>
        </div>
        <h1 className="font-bold text-xl text-custom-primary">
          {member.points}
        </h1>
        {type === "GOLD" && <div className="shimmer slow" />}
      </div>
    );
  }
}
