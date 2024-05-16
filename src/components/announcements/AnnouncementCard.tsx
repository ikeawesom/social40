"use client";
import { ANNOUNCEMENT_SCHEMA } from "@/src/utils/schemas/announcements";
import React from "react";
import DefaultCard from "../DefaultCard";
import Link from "next/link";
import HRow from "../utils/HRow";
import { TimestampToDateString } from "@/src/utils/helpers/getCurrentDate";
import Image from "next/image";
import { deletePost } from "./submitPostData";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AnnouncementTag from "./AnnouncementTag";

export default function AnnouncementCard({
  announcementData,
  curMember,
}: {
  announcementData: ANNOUNCEMENT_SCHEMA;
  curMember: string;
}) {
  const router = useRouter();

  const { announcementID, createdBy, createdOn, desc, title, groups, pin } =
    announcementData;

  const descLines = desc.split("$a");

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this post? This is irreversible!"
      )
    ) {
      try {
        const res = await deletePost(announcementID ?? "");
        if (!res.status) throw new Error(res.error);
        router.refresh();
        toast.success("Post deleted");
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };
  return (
    <DefaultCard className="w-full">
      <div className="w-full flex items-center justify-between gap-2 pb-1">
        <Link
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
      <h1 className="font-bold text-xl mb-3">{title}</h1>
      {descLines.map((line: string, index: number) => {
        if (line === "") return <br key={index} />;
        return (
          <p
            key={index}
            className="text-custom-dark-text text-sm"
          >{`${line}`}</p>
        );
      })}
      <div className="flex items-center justify-between gap-3 mt-3">
        {createdOn && (
          <div className="flex flex-col items-start justify-start gap-2">
            {groups && (
              <div className="flex items-start justify-start gap-2">
                {groups.map((id: string, index: number) => (
                  <AnnouncementTag key={index}> {id}</AnnouncementTag>
                ))}
              </div>
            )}
            <p className="text-xs text-custom-grey-text">
              {TimestampToDateString(createdOn).split(" ")[0]}
            </p>
          </div>
        )}
        {curMember === createdBy && (
          <Image
            onClick={handleDelete}
            className="cursor-pointer self-end"
            src="/icons/icon_trash.svg"
            alt="Delete Post"
            height={25}
            width={25}
          />
        )}
      </div>
    </DefaultCard>
  );
}
