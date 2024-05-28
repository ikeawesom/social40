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
  } = announcementData;

  const descLines = desc.split("$a");

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
      <h1 className="font-bold text-xl mb-2">{title}</h1>
      {descLines.map((line: string, index: number) => {
        if (line === "") return <br key={index} />;
        return (
          <p
            key={index}
            className="text-custom-dark-text text-sm"
          >{`${line}`}</p>
        );
      })}

      {mediaFiles.length > 0 && (
        <ScrollMedia mediaFiles={mediaFiles} className="mt-2" />
      )}
      <div className="flex items-center justify-between gap-3 mt-3">
        {createdOn && (
          <div className="flex flex-col items-start justify-start gap-1">
            <p className="text-xs text-custom-grey-text">
              {TimestampToDateString(createdOn).split(" ")[0]}
            </p>
            {groups && curMember === createdBy && (
              <div className="flex items-start justify-start gap-2">
                {groups.map((id: string, index: number) => (
                  <AnnouncementTag
                    className="px-1 py-[2px] text-xs"
                    key={index}
                  >
                    {" "}
                    {id}
                  </AnnouncementTag>
                ))}
              </div>
            )}
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
