"use client";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import StatusDot from "../../utils/StatusDot";
import { GROUP_ROLES_HEIRARCHY, MAX_LENGTH } from "@/src/utils/constants";
import Modal from "../../utils/Modal";
import HRow from "../../utils/HRow";
import Image from "next/image";
import LoadingIcon from "../../utils/LoadingIcon";
import { toast } from "sonner";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { GROUP_MEMBERS_SCHEMA } from "@/src/utils/schemas/groups";

export default function GroupMemberTab({
  data,
  groupID,
  className,
  curMember,
  addOnline,
}: {
  data: {
    dateJoined: string;
    memberID: string;
    role: string;
    displayName?: string | undefined;
    bookedIn?: boolean | undefined;
  };
  groupID: string;
  className?: string;
  curMember: GROUP_MEMBERS_SCHEMA;
  addOnline: () => void;
}) {
  const { host } = useHostname();
  const router = useRouter();
  const displayName = data.displayName as string;
  const groupMemberID = data.memberID;
  const bookedIn = data.bookedIn as boolean;
  const dateJoined = data.dateJoined;
  const role = data.role;
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
  return (
    <>
      {show && (
        <Modal className="min-[400px]:p-4">
          {loading ? (
            <div className="w-full grid place-items-center">
              <LoadingIcon height={50} width={50} />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between w-full">
                <h1 className="text-custom-dark-text font-semibold">
                  {displayName}
                </h1>
                <button
                  onClick={() => setShow(false)}
                  className="hover:opacity-75 duration-200"
                >
                  <Image
                    src="/icons/icon_close.svg"
                    alt="Close"
                    width={15}
                    height={15}
                  />
                </button>
              </div>
              <HRow />
              <div className="flex flex-col items-center justify-start mt-2 gap-1">
                <div
                  className="w-full p-2 text-sm rounded-lg hover:bg-custom-light-text duration-200"
                  onClick={() =>
                    router.push(`/members/${groupMemberID}`, { scroll: false })
                  }
                >
                  View Profile
                </div>
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
        onClick={() => setShow(true)}
        className={twMerge(
          "w-full py-2 px-3 shadow-sm duration-300 flex items-center justify-between cursor-pointer",
          curMember.memberID === groupMemberID
            ? "bg-custom-light-orange hover:brightness-95"
            : "hover:bg-custom-light-text",
          className
        )}
      >
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
            Joined on: {dateJoined}
          </p>
        </div>
      </div>
    </>
  );
}
