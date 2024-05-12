"use client";
import React, { useState } from "react";
import Image from "next/image";
import Modal from "@/src/components/utils/Modal";
import ModalHeader from "@/src/components/utils/ModalHeader";

export default function LastUpdatedHAQuestion() {
  const [show, setShow] = useState(false);
  return (
    <>
      {show && (
        <Modal>
          <ModalHeader close={() => setShow(false)} heading="What is this?" />
          <p className="text-custom-dark-text text-start">
            Social40 automatically calculates each individual member's HA
            currency from{" "}
            <span className="font-bold">0000 to 0800 UTC+8 every midnight</span>
            . <br />
            This is to make HA tracking more seamless and efficient!
          </p>
        </Modal>
      )}
      <Image
        onClick={() => setShow(true)}
        alt="?"
        src={
          !show
            ? "/icons/icon_question.svg"
            : "/icons/icon_question_primary.svg"
        }
        width={20}
        height={20}
      />
    </>
  );
}
