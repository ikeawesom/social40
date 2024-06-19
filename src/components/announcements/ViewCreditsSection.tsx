"use client";

import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import React, { useState } from "react";
import Image from "next/image";
import DefaultCard from "../DefaultCard";
import SecondaryButton from "../utils/SecondaryButton";
import PrimaryButton from "../utils/PrimaryButton";
import { toggleViewCredits } from "@/src/utils/members/toggleCredits";
import { toast } from "sonner";
import Link from "next/link";

export default function ViewCreditsSection({
  memberData,
}: {
  memberData: MEMBER_SCHEMA;
}) {
  const { memberID, viewCredits } = memberData;
  const [show, setShow] = useState(viewCredits);

  const toggleDB = async () => {
    try {
      const { error } = await toggleViewCredits(memberID);
      if (error) throw new Error(error);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDismiss = async () => {
    setShow(true);
    await toggleDB();
    toast.message("You may also view credits in your settings page!");
  };

  if (!show)
    return (
      <div className="rounded-lg w-full relative overflow-hidden gradient-box p-1">
        <DefaultCard className="bg-gradient-to-br from-orange-50 to-red-100 w-full flex items-center justify-center flex-col gap-2 p-3">
          <Image src="/icons/icon_heart.png" width={50} height={50} alt="" />
          <h1 className="text-custom-dark-text font-semibold">
            Meet the team behind Social
            <span className="text-custom-primary">40</span>.
          </h1>
          <div className="w-full flex items-center justify-center gap-2">
            <SecondaryButton onClick={handleDismiss} className="px-3 w-fit">
              Dismiss
            </SecondaryButton>
            <Link
              onClick={handleDismiss}
              scroll={false}
              href="/credits"
              className="w-fit"
            >
              <PrimaryButton className="px-3 w-fit">
                Take Me There
              </PrimaryButton>
            </Link>
          </div>
        </DefaultCard>
        <div className="shimmer slow" />
      </div>
    );
}
