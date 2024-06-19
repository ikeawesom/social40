"use client";
import React from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

export default function HomeHeaderBar({ params }: { params: string }) {
  return (
    <div
      className={twMerge(
        "w-full bg-white shadow-sm fixed top-0 left-0 flex items-center justify-start flex-col z-40"
      )}
    >
      <div className="flex items-center justify-center gap-x-2 z-40 w-full p-2">
        <h1 className="font-semibold text-custom-dark-text text-2xl">
          Social<span className="text-custom-primary">40</span>
        </h1>
        <Image
          src="/icons/icon_coin.svg"
          alt="Social40"
          width={30}
          height={30}
        />
      </div>

      <div className="w-full items-center justify-between flex max-w-[500px]">
        <Link
          scroll={false}
          key="announcements"
          href={`/home?${new URLSearchParams({ activity: "announcements" })}`}
          className={twMerge(
            "text-custom-grey-text font-semibold flex-1 px-4 py-2 border-b-2 text-center duration-150 hover:bg-custom-light-text",
            params === "announcements" &&
              "border-b-custom-primary text-custom-primary"
          )}
        >
          Announcements
        </Link>
        <Link
          scroll={false}
          key="groups"
          href={`/home?${new URLSearchParams({ activity: "groups" })}`}
          className={twMerge(
            "text-custom-grey-text font-semibold flex-1 px-4 py-2 border-b-2 text-center duration-150 hover:bg-custom-light-text",
            params === "groups" && "border-b-custom-primary text-custom-primary"
          )}
        >
          Activities
        </Link>
      </div>
    </div>
  );
}
