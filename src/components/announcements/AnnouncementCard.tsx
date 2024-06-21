"use client";
import { ANNOUNCEMENT_SCHEMA } from "@/src/utils/schemas/announcements";
import React from "react";
import DefaultCard from "../DefaultCard";
import Link from "next/link";
import HRow from "../utils/HRow";
import { TimestampToDateString } from "@/src/utils/helpers/getCurrentDate";
import Image from "next/image";
import AnnouncementTag from "./AnnouncementTag";
import DeleteButton from "./card/DeleteButton";
import ScrollMedia from "./media/ScrollMedia";
import { DisplayMediaType } from "./media/AddMedia";
import LikeButton from "../utils/LikeButton";

const transformString = (input: string) => {
  return input.split("$a").map((part, index) => {
    const segments: React.ReactNode[] = [];
    let remainingText = part;

    while (remainingText.includes("@")) {
      const atIndex = remainingText.indexOf("@");
      const nextSpaceIndex = remainingText.indexOf(" ", atIndex);
      const endIndex =
        nextSpaceIndex === -1 ? remainingText.length : nextSpaceIndex;

      if (atIndex > 0) {
        segments.push(remainingText.slice(0, atIndex));
      }

      const highlightedText = remainingText.slice(atIndex, endIndex);
      segments.push(
        <Link
          key={segments.length}
          href={`/members/${highlightedText.substring(
            1,
            highlightedText.length
          )}`}
          className="text-custom-primary font-bold hover:opacity-70 duration-150"
        >
          {highlightedText}
        </Link>
      );
      remainingText = remainingText.slice(endIndex);
    }

    if (remainingText) {
      segments.push(remainingText);
    }

    return (
      <React.Fragment key={index}>
        {segments}
        {index < input.split("$a").length - 1 && <br />}
      </React.Fragment>
    );
  });
};

export default function AnnouncementCard({
  announcementData,
  curMember,
}: {
  announcementData: ANNOUNCEMENT_SCHEMA;
  curMember: string;
}) {
  const {
    announcementID,
    createdBy,
    createdOn,
    desc,
    title,
    groups,
    pin,
    media,
    likes,
  } = announcementData;

  let mediaFiles = [] as DisplayMediaType[];
  if (media) {
    media.forEach((src: string) => {
      mediaFiles.push({ file: null, id: src, src });
    });
  }

  return (
    <DefaultCard className="w-[90vw] max-w-[500px]">
      <div className="w-full flex items-center justify-between gap-2 pb-1">
        <Link
          scroll={false}
          href={`/members/${createdBy}`}
          className="text-xs text-custom-grey-text duration-150 hover:opacity-70"
        >
          {createdBy}
        </Link>
        {pin && (
          <Image
            alt="Pinned"
            src="/icons/icon_pin.svg"
            width={10}
            height={10}
          />
        )}
      </div>
      <HRow className="mb-2" />
      <div className="mb-2">
        <h1 className="font-bold text-xl">{title}</h1>
        {groups && curMember === createdBy && (
          <div className="flex items-start justify-start gap-2 mb-1 mt-1">
            {groups.map((id: string, index: number) => (
              <AnnouncementTag
                className="bg-custom-grey-text/80 px-1 py-[2px] text-xs"
                key={index}
              >
                {" "}
                {id}
              </AnnouncementTag>
            ))}
          </div>
        )}
      </div>
      <p className="text-custom-dark-text text-sm">{transformString(desc)}</p>
      {mediaFiles.length > 0 && (
        <ScrollMedia mediaFiles={mediaFiles} className="mt-2" />
      )}
      <div className="flex items-center justify-between gap-3 mt-3">
        {createdOn && (
          <div>
            <LikeButton
              id={announcementID ?? ""}
              memberID={curMember}
              likes={likes ?? []}
              className="mb-2"
            />
            <p className="text-xs text-custom-grey-text">
              {TimestampToDateString(createdOn).split(" ")[0]}
            </p>
          </div>
        )}
        {curMember === createdBy && (
          <DeleteButton
            haveMedia={mediaFiles.length > 0}
            id={announcementID ?? ""}
          />
        )}
      </div>
    </DefaultCard>
  );
}
