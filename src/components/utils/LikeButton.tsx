"use client";

import {
  getAnnouncementLikes,
  toggleLikes,
} from "@/src/utils/home/toggleLikes";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import Modal from "./Modal";
import ModalHeader from "./ModalHeader";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import ModalLoading from "./ModalLoading";
import ErrorSection from "./ErrorSection";
import BasicMemberCard from "../search/BasicMemberCard";

export default function LikeButton({
  likes,
  className,
  textClassName,
  size,
  memberID,
  id,
}: {
  id: string;
  likes: string[];
  className?: string;
  textClassName?: string;
  size?: number;
  memberID: string;
  pathname?: string;
}) {
  const liked = likes.includes(memberID);

  const [isLiked, setIsLiked] = useState(liked);
  const [clientLikes, setClientLike] = useState(likes);
  const [show, setShow] = useState(false);
  const [members, setMembers] = useState<MEMBER_SCHEMA[]>();
  const [errorMsg, setError] = useState("");

  const handleClient = () => {
    if (!clientLikes.includes(memberID)) {
      setClientLike([...clientLikes, memberID]);
    } else {
      setClientLike((prev) => prev.filter((id) => id !== memberID));
    }
  };

  const resetClient = () => {
    setIsLiked(liked);
    setClientLike(likes);
  };

  const toggle = async () => {
    setIsLiked(!isLiked);
    handleClient();
    try {
      const { error } = await toggleLikes({ id, memberID });
      if (error) throw new Error(error);
    } catch (err: any) {
      resetClient();
      console.log(err);
    }
  };

  const fetchData = async () => {
    try {
      const { data, error } = await getAnnouncementLikes(id);
      if (error) throw new Error(error);
      setMembers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };
  useEffect(() => {
    if (show) fetchData();
  }, [show]);

  return (
    <>
      {show && (
        <Modal>
          <ModalHeader close={() => setShow(false)} heading="Likes" />
          {errorMsg !== "" ? (
            <ErrorSection errorMsg={`${errorMsg}`} />
          ) : members ? (
            members.length > 0 ? (
              <div className="w-full flex items-start justify-start gap-2 flex-col">
                {members.map((item: MEMBER_SCHEMA, index: number) => (
                  <BasicMemberCard member={item} key={index} />
                ))}
              </div>
            ) : (
              <ErrorSection>Aw, no likes here.. Be the first?</ErrorSection>
            )
          ) : (
            <ModalLoading />
          )}
        </Modal>
      )}
      <div
        className={twMerge(
          "w-fit flex items-center justify-center gap-1",
          className
        )}
      >
        <Image
          onClick={toggle}
          alt="Like"
          src={
            isLiked
              ? "/icons/icon_heart_red.svg"
              : "/icons/icon_heart_outline_grey.svg"
          }
          width={size ?? 25}
          height={size ?? 25}
          className="hover:opacity-70 duration-150 cursor-pointer"
        />
        <p
          onClick={() => setShow(true)}
          className={twMerge(
            "text-sm cursor-pointer hover:opacity-70 duration-150",
            isLiked ? "text-custom-red font-bold" : "text-custom-grey-text",
            textClassName
          )}
        >
          {clientLikes.length}
        </p>
      </div>
    </>
  );
}
