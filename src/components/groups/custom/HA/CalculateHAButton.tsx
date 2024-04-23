"use client";

import React from "react";
import Modal from "../../../utils/Modal";
import PrimaryButton from "../../../utils/PrimaryButton";
import Image from "next/image";
import HRow from "../../../utils/HRow";
import { GroupDetailsType } from "../GroupMembers";
import { useHADetails } from "@/src/hooks/groups/custom/useHADetails";
import HAForm from "./HAForm";

export default function CalculateHAButton({
  membersList,
  groupID,
}: {
  membersList: GroupDetailsType;
  groupID: string;
}) {
  const { enable, disable, show } = useHADetails();

  return (
    <>
      {show && (
        <Modal>
          <div className="mb-2">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-custom-dark-text font-semibold">
                Calculate HA
              </h1>
              <button
                onClick={disable}
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
          </div>
          <HAForm membersList={membersList} groupID={groupID} />
        </Modal>
      )}
      <PrimaryButton
        className="flex items-center justify-center gap-2"
        onClick={enable}
      >
        Calculate HA
        <Image
          alt=""
          src="/icons/features/icon_bolt.svg"
          width={13}
          height={13}
        />
      </PrimaryButton>
    </>
  );
}
