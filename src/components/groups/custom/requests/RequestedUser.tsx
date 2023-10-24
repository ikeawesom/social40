import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import Image from "next/image";
import { WAITLIST_SCHEMA } from "@/src/utils/schemas/waitlist";
import { toast } from "sonner";
import { OnboardNewMember } from "@/src/utils/onboarding/OnboardNewMember";
import { OnboardGroupMember } from "@/src/utils/onboarding/OnboardGroupMember";
import LoadingIcon from "@/src/components/utils/LoadingIcon";

type GroupItemType = {
  className?: string;
  data: WAITLIST_SCHEMA;
  groupID: string;
};

const MAX_LENGTH = 20;

export default function RequestedUser({
  className,
  data,
  groupID,
}: GroupItemType) {
  const [loading, setLoading] = useState(false);
  const { displayName, memberID, password } = data;
  const email = memberID + "@digital40sar.com";

  const handleAccept = async () => {
    setLoading(true);
    try {
      const onboardMemberStatus = await OnboardNewMember({
        displayName,
        memberID,
        email,
        password,
        role: "member",
      });

      if (!onboardMemberStatus.status)
        throw new Error(onboardMemberStatus.error);

      const onboardGroupStatus = await OnboardGroupMember({
        groupID,
        memberID,
        role: "member",
      });

      if (!onboardGroupStatus.status) throw new Error(onboardGroupStatus.error);
      toast.success(`${memberID} added to ${groupID}.`);
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const handleReject = () => {};
  return (
    <div
      className={twMerge(
        "w-full rounded-lg py-2 px-3 shadow-sm hover:bg-custom-light-text duration-300 flex items-center justify-between",
        className
      )}
    >
      {loading ? (
        <div className="w-full grid place-items-center">
          <LoadingIcon width={30} height={30} />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-start justify-center">
            <h1 className="font-medium text-sm">{displayName}</h1>
            <p className="text-xs text-custom-grey-text">
              {memberID.length > MAX_LENGTH
                ? memberID.substring(0, MAX_LENGTH - 3) + "..."
                : memberID}
            </p>
          </div>
          <div className="flex items-center justify-center gap-1 duration-200">
            <PrimaryButton
              className="p-1 bg-custom-light-green border-[1px] border-custom-green"
              onClick={handleAccept}
            >
              <Image
                src="/icons/icon_tick.svg"
                alt="Accept"
                width={20}
                height={20}
              />
            </PrimaryButton>
            <SecondaryButton
              className="p-1 bg-custom-light-red border-[1px] border-custom-red"
              onClick={handleReject}
            >
              <Image
                src="/icons/icon_cross.svg"
                width={20}
                height={20}
                alt="Reject"
              />
            </SecondaryButton>
          </div>
        </>
      )}
    </div>
  );
}
