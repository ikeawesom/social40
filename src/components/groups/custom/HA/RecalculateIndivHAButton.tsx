"use client";

import PrimaryButton from "@/src/components/utils/PrimaryButton";
import React, { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import ModalLoading from "@/src/components/utils/ModalLoading";
import Modal from "@/src/components/utils/Modal";
import { calculateGroupIndivHA } from "@/src/utils/HA/calculateIndivHA";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { handleReload } from "@/src/components/navigation/HeaderBar";

// const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function RecalculateIndivHAButton({
  groupID,
  members,
}: {
  groupID: string;
  members: string[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [curMem, setCur] = useState<string[]>([]);
  const progRef = useRef(0);

  const recalc = async () => {
    if (
      confirm(
        "Are you sure you want to re-calculate again? This will take a few minutes, depending on the group size."
      )
    ) {
      setLoading(true);
      try {
        for (const member of members) {
          setCur([member, ...curMem]);
          const { error } = await calculateGroupIndivHA(groupID, [member]);
          if (error) throw new Error(error.message);
          progRef.current += 1;
        }
        toast.success(
          "Great, all group members' HA have been re-calculated. Refreshing to show changes..."
        );
        handleReload(router);
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  const prog = Math.round((progRef.current / members.length) * 100);
  return (
    <>
      {loading && (
        <Modal>
          <ModalLoading>
            <div className="mt-3 text-custom-grey-text">
              <p className="text-sm">{prog}%</p>
              <p className="text-xs mt-[3px]">{`Calculating ${curMem[0]}...`}</p>
            </div>
          </ModalLoading>
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
