"use client";
import { ANNOUNCEMENT_SCHEMA } from "@/src/utils/schemas/announcements";
import React from "react";
import DefaultCard from "../DefaultCard";
import Link from "next/link";
import HRow from "../utils/HRow";
import { TimestampToDateString } from "@/src/utils/getCurrentDate";
import Image from "next/image";
import { deletePost } from "./submitPostData";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AnnouncementCard({
  announcementData,
  curMember,
}: {
  announcementData: ANNOUNCEMENT_SCHEMA;
  curMember: string;
}) {
  const router = useRouter();

  const { announcementID, createdBy, createdOn, desc, title } =
    announcementData;

  const descLines = desc.split("$a");

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this post? This is irreversible!"
      )
    ) {
      try {
        const res = await deletePost(announcementID);
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
      <Link
        href={`/members/${createdBy}`}
        className="text-xs text-custom-grey-text duration-200 hover:opacity-70"
      >
        {createdBy}
      </Link>
      <HRow className="mb-2" />
      <h1 className="font-bold text-xl">{title}</h1>
      {descLines.map((line: string, index: number) => {
        if (line === "") return <br key={index} />;
        return (
          <p
            key={index}
            className="text-custom-dark-text text-sm"
          >{`${line}`}</p>
        );
      })}
      <div className="flex items-center justify-between gap-3 mt-2">
        <p className="text-xs text-custom-grey-text">
          {TimestampToDateString(createdOn).split(" ")[0]}
        </p>
        {curMember === createdBy && (
          <Image
            onClick={handleDelete}
            className="cursor-pointer"
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
