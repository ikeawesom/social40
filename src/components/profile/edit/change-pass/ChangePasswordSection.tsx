"use client";
import React, { useState } from "react";
import DefaultCard from "../../../DefaultCard";
import ChangePasswordForm from "./ChangePasswordForm";
import Image from "next/image";
import Modal from "@/src/components/utils/Modal";
import ModalHeader from "@/src/components/utils/ModalHeader";

export default function ChangePasswordSection() {
  const [show, setShow] = useState(false);
  return (
    <>
      {show && (
        <Modal>
          <ModalHeader heading="Change Password" close={() => setShow(false)} />
          <ChangePasswordForm />
        </Modal>
      )}
      <DefaultCard
        onClick={() => setShow(true)}
        className="cursor-pointer w-full py-2 px-3 hover:brightness-95 duration-150"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center justify-start gap-2">
            <Image src="/icons/icon_lock.svg" width={25} height={25} alt="" />
            <h1 className="text-custom-dark-text font-semibold text-start text-sm">
              Change Password
            </h1>
          </div>
          <Image
            src="/icons/icon_arrow-down.svg"
            width={30}
            height={30}
            alt="Show"
            className="-rotate-90"
          />
        </div>
      </DefaultCard>
    </>
  );
}
