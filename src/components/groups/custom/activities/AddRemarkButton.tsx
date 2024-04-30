"use client";
import React, { useState } from "react";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import Modal from "@/src/components/utils/Modal";
import AddRemarkForm from "./AddRemarkForm";
import ModalHeader from "@/src/components/utils/ModalHeader";

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
          <ModalHeader close={() => setShow(false)} heading="Add Remark" />
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
