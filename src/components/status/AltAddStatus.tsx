"use client";

import React, { useState } from "react";
import PrimaryButton from "../utils/PrimaryButton";
import Modal from "../utils/Modal";
import ModalHeader from "../utils/ModalHeader";
import CreateStatus from "./CreateStatus";

export default function AltAddStatus({
  alt,
  memberID,
}: {
  memberID: string;
  alt: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <>
      {show && (
        <Modal>
          <ModalHeader close={() => setShow(false)} heading="Add Status" />
          <CreateStatus
            memberID={memberID}
            alt={alt}
            close={() => setShow(false)}
          />
        </Modal>
      )}
      <PrimaryButton onClick={() => setShow(true)}>Add Status</PrimaryButton>
    </>
  );
}
