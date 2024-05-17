import { GROUP_MEMBERS_SCHEMA } from "@/src/utils/schemas/groups";
import React from "react";
import Image from "next/image";
import { contentfulImageLoader } from "@/src/components/profile/edit/ProfilePicSection";
import { twMerge } from "tailwind-merge";
import { PodiumType } from "@/src/utils/constants";
import Link from "next/link";
export default function PodiumMember({
  member,
  type,
  scoreStr,
}: {
  member: GROUP_MEMBERS_SCHEMA;
  type: PodiumType | string;
  scoreStr: string;
}) {
  const isBest = type === "GOLD";
  return (
    <div className="items-center justify-center flex-col flex gap-5">
      <div className="relative">
        <div
          className={twMerge(
            "overflow-hidden rounded-full shadow-lg relative flex items-center justify-center border-[3px]",
            isBest
              ? "min-[400px]:w-[100px] min-[400px]:h-[100px] w-[90px] h-[90px] border-custom-orange"
              : type === "SILVER"
              ? "min-[400px]:w-[80px] min-[400px]:h-[80px] w-[70px] h-[70px] border-gray-300"
              : "min-[400px]:w-[80px] min-[400px]:h-[80px] w-[70px] h-[70px] border-[#d3795d]"
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
        <div
          className={twMerge(
            "absolute grid place-items-center -bottom-4 left-1/2 -translate-x-1/2 z-40 rounded-full h-[25px] shadow-md w-[25px]",
            type === "GOLD"
              ? "bg-custom-orange"
              : type === "SILVER"
              ? "bg-gray-300"
              : type === "BRONZE" && "bg-[#d3795d]"
          )}
        >
          <p className="font-bold text-custom-dark-text text-xs text-center">
            {type === "GOLD"
              ? "1"
              : type === "SILVER"
              ? "2"
              : type === "BRONZE" && "3"}
          </p>
        </div>
        {isBest && (
          <Image
            className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 drop-shadow-md"
            alt="Crown"
            width={60}
            height={60}
            src="/icons/features/icon_crown.png"
          />
        )}
      </div>
      <div className="flex flex-col items-center justify-center">
        <Link
          scroll={false}
          href={`/members/${member.memberID}`}
          className="text-sm font-bold hover:text-custom-primary duration-150"
        >
          {member.displayName}
        </Link>
        <h1 className="font-bold text-custom-primary text-lg">{scoreStr}</h1>
      </div>
    </div>
  );
}
