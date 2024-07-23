"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import PrimaryButton from "../../utils/PrimaryButton";
import Image from "next/image";
import Modal from "../../utils/Modal";
import ModalHeader from "../../utils/ModalHeader";
import ModalLoading from "../../utils/ModalLoading";
import { toast } from "sonner";
import { recalcIndivHA } from "./recalcIndivHA";
import { handleReload } from "../../navigation/HeaderBar";
import { useRouter } from "next/navigation";

export default function RecalcIndivHAButton({
  memberID,
}: {
  memberID: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const recalc = async () => {
    if (
      confirm(
        "Are you sure you want to re-calculate again? This may take a moment."
      )
    ) {
      setLoading(true);
      try {
        const { error } = await recalcIndivHA(memberID);
        if (error) throw new Error(error);
        toast.success("Nice, we re-calculated this member's HA.");
        handleReload(router);
      } catch (err: any) {
        toast.error(err.message);
      }
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <Modal>
          <ModalHeader heading="Re-calculate HA" />
          <ModalLoading text="Working... Please do not close or refresh this page." />
        </Modal>
      )}
      <PrimaryButton
        className={twMerge("flex items-center justify-center gap-2")}
        onClick={recalc}
      >
        Re-calculate Individual HA
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
