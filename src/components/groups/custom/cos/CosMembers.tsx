"use client";

import DefaultCard from "@/src/components/DefaultCard";
import Modal from "@/src/components/utils/Modal";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import HRow from "@/src/components/utils/HRow";
import { useMemberID } from "@/src/hooks/useMemberID";
import { GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import LoadingIcon from "@/src/components/utils/LoadingIcon";
import { useCOSMembers } from "@/src/hooks/groups/custom/COS/useCosMembers";

export default function CosMembers({
  membersPoints,
  admins,
  groupData,
}: {
  membersPoints: { [memberID: string]: number };
  admins: string[];
  groupData: GROUP_SCHEMA;
}) {
  const {
    clickedID,
    setClickedID,
    handleRemove,
    load,
    setShowAll,
    showAll,
    toggleAdmin,
  } = useCOSMembers(groupData);

  const { memberID } = useMemberID();

  return (
    <>
      {clickedID !== "" && (
        <Modal className="min-[400px]:p-4">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-custom-dark-text font-semibold">{clickedID}</h1>
            <button
              onClick={() => setClickedID("")}
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
          <HRow className="mb-2" />
          {load ? (
            <div className="w-full grid place-items-center">
              <LoadingIcon height={30} width={30} />
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center justify-start mt-2 gap-1">
                <Link
                  className="w-full p-2 text-sm rounded-lg hover:bg-custom-light-text duration-200"
                  href={`/members/${clickedID}`}
                >
                  View Profile
                </Link>
              </div>
              {admins.includes(memberID) && (
                <div className="flex flex-col items-center justify-start mt-2 gap-1 cursor-pointer">
                  <div
                    className="w-full p-2 text-sm rounded-lg hover:bg-custom-light-text duration-200"
                    onClick={() => toggleAdmin(clickedID)}
                  >
                    {admins.includes(clickedID)
                      ? "Remove as Admin"
                      : "Make Admin"}
                  </div>
                </div>
              )}
              {admins.includes(memberID) && (
                <div className="flex flex-col items-center justify-start mt-2 gap-1 cursor-pointer">
                  <div
                    className="w-full p-2 text-sm rounded-lg hover:bg-custom-light-text duration-200"
                    onClick={() => handleRemove(clickedID)}
                  >
                    Remove as Participant
                  </div>
                </div>
              )}
            </>
          )}
        </Modal>
      )}
      {Object.keys(membersPoints).length === 0 ? (
        <div className="min-h-[10vh] bg-white grid place-items-center p-2 rounded-md">
          <p className="text-sm text-custom-grey-text">
            Looks like you haven't added any members.
          </p>
        </div>
      ) : (
        Object.keys(membersPoints)
          .splice(0, showAll ? Object.keys(membersPoints).length : 3)
          .map((id: string, index: number) => (
            <>
              <div
                className="w-full cursor-pointer"
                key={id}
                onClick={() => setClickedID(id)}
              >
                <DefaultCard className="w-full py-2 px-3 flex items-center justify-between hover:brightness-95 duration-150 mb-2">
                  <h1 className="text-custom-dark-text flex items-start justify-start gap-1">
                    {index < 3 && (
                      <div className="h-[20px] w-[20px] grid place-items-center rounded-full bg-custom-primary text-custom-light-text translate-y-[2px]">
                        <p className="text-sm">{index + 1}</p>
                      </div>
                    )}{" "}
                    {id}
                  </h1>
                  <h4 className="text-custom-dark-text font-bold">
                    {membersPoints[id]}
                  </h4>
                </DefaultCard>
              </div>
            </>
          ))
      )}
      <div className="flex items-center justify-end mt-2">
        <p
          onClick={() => setShowAll(!showAll)}
          className="text-sm underline cursor-pointer hover:text-custom-primary text-custom-grey-text"
        >
          {showAll ? "Hide" : `View all (${Object.keys(membersPoints).length})`}
        </p>
      </div>
    </>
  );
}
