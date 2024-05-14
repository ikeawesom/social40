"use client";
import React, { useState } from "react";
import Image from "next/image";
import Modal from "@/src/components/utils/Modal";
import ModalHeader from "@/src/components/utils/ModalHeader";
import Link from "next/link";

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
            . This is to make HA tracking more seamless and efficient!
          </p>
          <div className="w-full flex items-center justify-start mt-1">
            <Link
              className="text-start underline text-sm duration-150 text-custom-primary hover:opacity-70"
              href="https://social40.notion.site/v1-5-0-New-Automated-Heat-Acclimatisation-HA-System-9d6a732195034ff8b11869d0f4c9cfae"
            >
              Learn More
            </Link>
          </div>
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
        className="cursor-pointer"
        width={20}
        height={20}
      />
    </>
  );
}
