"use client";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import StatusDot from "../../utils/StatusDot";
import { GROUP_ROLES_HEIRARCHY, MAX_LENGTH } from "@/src/utils/constants";
import Modal from "../../utils/Modal";
import Image from "next/image";
import { toast } from "sonner";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { GROUP_MEMBERS_SCHEMA } from "@/src/utils/schemas/groups";
import { DateToString } from "@/src/utils/getCurrentDate";
import Link from "next/link";
import { contentfulImageLoader } from "../../profile/edit/ProfilePicSection";
import ModalLoading from "../../utils/ModalLoading";
import ModalHeader from "../../utils/ModalHeader";

export default function GroupMemberTab({
  data,
  groupID,
  className,
  curMember,
  addOnline,
  handleBibo,
}: {
  data: GROUP_MEMBERS_SCHEMA;
  groupID: string;
  className?: string;
  curMember: GROUP_MEMBERS_SCHEMA;
  handleBibo: {
    state: {
      state: boolean;
      members: string[];
    };
    action: React.Dispatch<
      React.SetStateAction<{
        state: boolean;
        members: string[];
      }>
    >;
  };
  addOnline: () => void;
}) {
  const { host } = useHostname();
  const router = useRouter();
  const displayName = data.displayName as string;
  const groupMemberID = data.memberID;
  const bookedIn = data.bookedIn as boolean;
  const role = data.role;
  const pfp = data.pfp;

  const tempTimestamp = data.dateJoined;
  const tempDate = new Date(tempTimestamp.seconds * 1000);
  const dateStr = DateToString(tempDate);

  const aboveAdmin =
    GROUP_ROLES_HEIRARCHY[role].rank >= GROUP_ROLES_HEIRARCHY["admin"].rank;
  const owner = role === "owner";

  const same = curMember.memberID === groupMemberID;

  const curMemberRole = curMember.role;
  const curAdmin =
    GROUP_ROLES_HEIRARCHY[curMemberRole].rank >=
    GROUP_ROLES_HEIRARCHY["admin"].rank;

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookedIn) {
      addOnline();
    }
  }, [bookedIn]);
  const handleAdmin = async (admin: boolean) => {
    setLoading(true);
    try {
      const PostObj = GetPostObj({ groupID, memberID: groupMemberID });
      if (admin) {
        const res = await fetch(`${host}/api/groups/make-admin`, PostObj);
        const body = await res.json();
        if (!body.status) throw new Error(body.error);
        toast.success(`Made ${groupMemberID} admin.`);
      } else {
        const res = await fetch(`${host}/api/groups/remove-admin`, PostObj);
        const body = await res.json();
        if (!body.status) throw new Error(body.error);
        toast.success(`Removed admin rights from ${groupMemberID}.`);
      }
      setShow(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      const PostObj = GetPostObj({ groupID, memberID: groupMemberID });
      const res = await fetch(`${host}/api/groups/remove-member`, PostObj);
      const body = await res.json();
      if (!body.status) throw new Error(body.error);
      toast.success(`Removed ${groupMemberID} from group.`);
      setShow(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };
  const route = `/members/${groupMemberID}`;
  return (
    <>
      {show && (
        <Modal className="min-[400px]:p-4">
          {loading ? (
            <ModalLoading />
          ) : (
            <>
              <ModalHeader close={() => setShow(false)} heading={displayName} />
              <div className="flex flex-col items-center justify-start mt-2 gap-1">
                <Link
                  className="w-full p-2 text-sm rounded-lg hover:bg-custom-light-text duration-200"
                  href={route}
                >
                  View Profile
                </Link>
                {curAdmin &&
                  !owner &&
                  !same &&
                  (aboveAdmin ? (
                    <div
                      onClick={() => handleAdmin(false)}
                      className="w-full p-2 text-sm rounded-lg hover:bg-custom-light-text duration-200"
                    >
                      Remove as Group Admin
                    </div>
                  ) : (
                    <div
                      onClick={() => handleAdmin(true)}
                      className="w-full p-2 text-sm rounded-lg hover:bg-custom-light-text duration-200"
                    >
                      Make Group Admin
                    </div>
                  ))}
                {curAdmin && !owner && !same && (
                  <div
                    onClick={handleRemove}
                    className="w-full p-2 text-sm rounded-lg hover:bg-custom-light-text duration-200"
                  >
                    Remove from Group
                  </div>
                )}
              </div>
            </>
          )}
        </Modal>
      )}
      <div
        onClick={() => {
          if (handleBibo.state.state) {
            const curArray = handleBibo.state.members as string[];
            if (curArray.includes(groupMemberID)) {
              const index = curArray.indexOf(groupMemberID);
              curArray.splice(index, 1);
            } else {
              curArray.push(groupMemberID);
            }
            handleBibo.action({
              ...handleBibo.state,
              members: curArray,
            });
          } else {
            setShow(true);
          }
        }}
        className={twMerge(
          "w-full py-2 px-3 shadow-sm duration-300 flex items-center justify-between cursor-pointer",
          curMember.memberID === groupMemberID && !handleBibo.state.state
            ? "bg-custom-light-orange hover:brightness-95"
            : "hover:bg-custom-light-text",

          handleBibo.state.members.includes(groupMemberID) &&
            "bg-custom-light-orange",
          className
        )}
      >
        <div className="flex items-center justify-start gap-3">
          <div className="overflow-hidden rounded-full shadow-lg w-10 h-10 relative">
            <Image
              loader={contentfulImageLoader}
              src={pfp ? pfp : "/icons/icon_avatar.svg"}
              fill
              sizes="100%"
              alt="Profile"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col items-start justify-center">
            <div className="flex items-center justify-start gap-1">
              <h1 className="font-bold text-sm text-custom-dark-text">
                {displayName}
              </h1>
              {role === "owner" && (
                <p className="text-xs text-custom-green">(owner)</p>
              )}
              {role === "admin" && (
                <p className="text-xs text-custom-orange">(admin)</p>
              )}
              <StatusDot status={bookedIn} />
            </div>
            <p className="text-xs text-custom-grey-text">
              {groupMemberID.length > MAX_LENGTH
                ? groupMemberID.substring(0, MAX_LENGTH - 3) + "..."
                : groupMemberID}
            </p>
            <p className="text-xs text-custom-grey-text">
              Joined on: {dateStr}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
