"use client";

import React from "react";
import Modal from "../../../utils/Modal";
import PrimaryButton from "../../../utils/PrimaryButton";
import Image from "next/image";
import { useHADetails } from "@/src/hooks/groups/custom/useHADetails";
import HAForm from "./HAForm";
import { twMerge } from "tailwind-merge";
import ModalHeader from "@/src/components/utils/ModalHeader";
import { GroupDetailsType } from "@/src/utils/schemas/groups";

export default function CalculateHAButton({
  membersList,
  groupID,
  className,
}: {
  membersList: GroupDetailsType;
  groupID: string;
  className?: string;
}) {
  const { enable, disable, show } = useHADetails();

  return (
    <>
      {show && (
        <Modal>
          <ModalHeader
            close={disable}
            className="mb-2"
            heading="Calculate HA"
          />
          <HAForm membersList={membersList} groupID={groupID} />
        </Modal>
      )}
      <PrimaryButton
        className={twMerge("flex items-center justify-center gap-2", className)}
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
