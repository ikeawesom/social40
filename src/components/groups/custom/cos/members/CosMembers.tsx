"use client";

import DefaultCard from "@/src/components/DefaultCard";
import Modal from "@/src/components/utils/Modal";
import Link from "next/link";
import React from "react";
import { useMemberID } from "@/src/hooks/useMemberID";
import { GROUP_SCHEMA } from "@/src/utils/schemas/groups";
import { useCOSMembers } from "@/src/hooks/groups/custom/COS/useCosMembers";
import ModalHeader from "@/src/components/utils/ModalHeader";
import ModalLoading from "@/src/components/utils/ModalLoading";
import { twMerge } from "tailwind-merge";
import FormInputContainer from "@/src/components/utils/FormInputContainer";
import PrimaryButton from "@/src/components/utils/PrimaryButton";

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
    modify,
    reset,
    curPoints,
    handleSubmit,
    onChangePoints,
    setCurPoints,
    setModify,
  } = useCOSMembers(groupData);

  const { memberID } = useMemberID();

  return (
    <>
      {clickedID !== "" && (
        <Modal>
          <ModalHeader close={reset} heading={clickedID} />
          {load ? (
            <ModalLoading />
          ) : (
            <>
              {!modify && (
                <>
                  <div className="flex flex-col items-center justify-start mt-2 gap-1">
                    <Link
                      className="w-full p-2 text-sm rounded-lg hover:bg-custom-light-text duration-200"
                      href={`/members/${clickedID}`}
                    >
                      View Profile
                    </Link>
                  </div>
                  <>
                    {admins.includes(memberID) && (
                      <div className="flex flex-col items-center justify-start mt-2 gap-1 cursor-pointer">
                        <div
                          className="w-full p-2 text-sm rounded-lg hover:bg-custom-light-text duration-200"
                          onClick={() => toggleAdmin(clickedID)}
                        >
                          {admins.includes(clickedID)
                            ? "Remove as COS Admin"
                            : "Make COS Admin"}
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
                </>
              )}
              {admins.includes(memberID) && (
                <div className="flex flex-col items-center justify-start mt-2 gap-1 cursor-pointer">
                  <div
                    className={twMerge(
                      "w-full p-2 text-sm rounded-lg hover:bg-custom-light-text duration-200",
                      modify && "bg-custom-light-text"
                    )}
                    onClick={() => {
                      setModify(!modify);
                      setCurPoints(membersPoints[clickedID].toString());
                    }}
                  >
                    Modify Points
                  </div>
                </div>
              )}
              {modify && (
                <form
                  onSubmit={handleSubmit}
                  className="flex items-end justify-start gap-2"
                >
                  <FormInputContainer
                    labelText="Edit Value"
                    inputName="points"
                    className="mt-2"
                  >
                    <input
                      type="number"
                      value={curPoints}
                      onChange={onChangePoints}
                      placeholder="Enter number of points for this member"
                    />
                  </FormInputContainer>
                  <PrimaryButton
                    type="submit"
                    disabled={
                      curPoints === membersPoints[clickedID].toString() ||
                      curPoints === ""
                    }
                    className="w-fit px-3 py-2"
                  >
                    Update
                  </PrimaryButton>
                </form>
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
