"use client";
import React, { useState } from "react";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import Modal from "@/src/components/utils/Modal";
import Image from "next/image";
import HRow from "@/src/components/utils/HRow";
import AddRemarkForm from "./AddRemarkForm";

export default function AddRemarkButton({
  className,
  activityID,
  memberID,
}: {
  className?: string;
  memberID: string;
  activityID: string;
}) {
  const [show, setShow] = useState(false);

  const showModal = () => {
    setShow(true);
  };

  return (
    <>
      {show && (
        <Modal className="flex flex-col items-center justify-start gap-2 w-full">
          <div className="w-full">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-custom-dark-text font-semibold">
                Add Remark
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
          </div>
          <AddRemarkForm
            close={() => setShow(false)}
            memberID={memberID}
            activityID={activityID}
          />
        </Modal>
      )}
      <PrimaryButton onClick={showModal} className={className}>
        Add a Remark
      </PrimaryButton>
    </>
  );
}
