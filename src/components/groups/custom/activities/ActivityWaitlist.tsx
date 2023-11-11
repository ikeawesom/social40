"use client";
import DefaultCard from "@/src/components/DefaultCard";
import HRow from "@/src/components/utils/HRow";
import InnerContainer from "@/src/components/utils/InnerContainer";
import LoadingIcon from "@/src/components/utils/LoadingIcon";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { TimestampToDateString } from "@/src/utils/getCurrentDate";
import { GROUP_ACTIVITY_WAITLIST } from "@/src/utils/schemas/group-activities";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export type ActivityWaitlistType = {
  [memberID: string]: GROUP_ACTIVITY_WAITLIST;
};
export default function ActivityWaitlist({
  requestsData,
  activityID,
}: {
  requestsData: ActivityWaitlistType;
  activityID: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { host } = useHostname();

  const handleReject = async (memberID: string) => {
    setLoading(true);
    try {
      const ActivityObj = GetPostObj({ memberID, activityID });
      const res = await fetch(`${host}/api/activity/group-reject`, ActivityObj);
      const body = await res.json();
      if (!body.status) throw new Error(body.error);
      router.refresh();
      toast.success(`Rejected ${memberID}`);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };
  const handleAccept = async (memberID: string) => {
    setLoading(true);
    try {
      const ActivityObj = GetPostObj({ memberID, activityID });
      const res = await fetch(
        `${host}/api/activity/group-participate`,
        ActivityObj
      );
      const body = await res.json();
      if (!body.status) throw new Error(body.error);
      router.refresh();
      toast.success(`Accepted ${memberID}`);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <DefaultCard className="w-full flex flex-col items-start justify-center gap-2 ">
      <div className="w-full flex flex-col items-start justify-center">
        <h1 className="text-custom-dark-text font-semibold">
          Requesting to Participate ( {Object.keys(requestsData).length} )
        </h1>
        <HRow />
      </div>
      <InnerContainer className="w-full">
        {loading && (
          <div className="w-full absolute grid place-items-center h-full bg-black/25 z-30">
            <LoadingIcon width={30} height={30} />
          </div>
        )}
        {Object.keys(requestsData).map((memberID: string) => {
          const date = requestsData[memberID].dateRequested;
          const dateStr = TimestampToDateString(date);
          return (
            <div
              key={memberID}
              className="w-full flex flex-col items-start justify-center py-2 px-3 duration-200 hover:bg-custom-light-text"
            >
              <Link
                href={`/members/${memberID}`}
                className="text-custom-dark-text font-semibold hover:opacity-70 duration-200"
              >
                {memberID}
              </Link>
              <h4 className="text-custom-grey-text text-sm">
                Requested on: {dateStr}
              </h4>
              <div className="w-full flex items-center justify-between gap-2 mt-2">
                <PrimaryButton
                  className="py-1 border-[1px] border-transparent"
                  onClick={() => handleAccept(memberID)}
                >
                  Accept
                </PrimaryButton>
                <SecondaryButton
                  className="border-custom-red text-custom-red py-1"
                  onClick={() => handleReject(memberID)}
                >
                  Reject
                </SecondaryButton>
              </div>
            </div>
          );
        })}
      </InnerContainer>
    </DefaultCard>
  );
}
