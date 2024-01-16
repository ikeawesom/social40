"use client";
import DefaultCard from "@/src/components/DefaultCard";
import HRow from "@/src/components/utils/HRow";
import InnerContainer from "@/src/components/utils/InnerContainer";
import { LoadingIconBright } from "@/src/components/utils/LoadingIcon";
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
import Image from "next/image";
import handleResponses from "@/src/utils/handleResponses";

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
  const [show, setShow] = useState(false);
  const router = useRouter();
  const { host } = useHostname();

  const handleReject = async (memberID: string) => {
    setLoading(true);
    try {
      const res = await rejectLogic(memberID);
      if (!res.status) throw new Error(res.error);
      router.refresh();
      toast.success(`Rejected ${memberID}`);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const rejectLogic = async (memberID: string) => {
    try {
      const ActivityObj = GetPostObj({ memberID, activityID });
      const res = await fetch(`${host}/api/activity/group-reject`, ActivityObj);
      const body = await res.json();
      if (!body.status) throw new Error(body.error);
      return handleResponses();
    } catch (err: any) {
      return handleResponses({ status: false, error: err.message });
    }
  };
  const handleAccept = async (memberID: string) => {
    setLoading(true);
    try {
      const res = await acceptLogic(memberID);
      if (!res.status) throw new Error(res.error);
      router.refresh();
      toast.success(`Accepted ${memberID}`);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const acceptLogic = async (memberID: string) => {
    try {
      const ActivityObj = GetPostObj({ memberID, activityID });
      const res = await fetch(
        `${host}/api/activity/group-participate`,
        ActivityObj
      );
      const body = await res.json();
      if (!body.status) throw new Error(body.error);
      return handleResponses();
    } catch (err: any) {
      return handleResponses({ status: false, error: err.message });
    }
  };

  const massAccept = async () => {
    setLoading(true);
    try {
      const promiseList = Object.keys(requestsData).map(
        async (memberID: string) => {
          const res = await acceptLogic(memberID);
          if (!res.status)
            return handleResponses({ status: false, error: res.error });
          return handleResponses();
        }
      );
      const promiseRes = await Promise.all(promiseList);

      promiseRes.forEach((item: any) => {
        if (!item.status) throw new Error(item.error);
      });
      router.refresh();
      toast.success("Successfully accepted all requests");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const massReject = async () => {
    setLoading(true);
    try {
      const promiseList = Object.keys(requestsData).map(
        async (memberID: string) => {
          const res = await rejectLogic(memberID);
          if (!res.status)
            return handleResponses({ status: false, error: res.error });
          return handleResponses();
        }
      );
      const promiseRes = await Promise.all(promiseList);

      promiseRes.forEach((item: any) => {
        if (!item.status) throw new Error(item.error);
      });
      router.refresh();
      toast.success("Successfully rejected all requests");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <DefaultCard className="w-full flex flex-col items-start justify-center gap-2 ">
      <div className="w-full flex flex-col items-start justify-center">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-custom-dark-text font-semibold flex gap-1 items-center justify-start text-start">
            Requests
            <span className="bg-custom-red text-custom-light-text font-medium px-2 rounded-full text-sm text-center my-2">
              {Object.keys(requestsData).length > 9
                ? "9+"
                : Object.keys(requestsData).length}
            </span>
          </h1>

          <Image
            onClick={() => setShow(!show)}
            src="/icons/icon_arrow-down.svg"
            alt="Show"
            width={30}
            height={30}
            className={`duration-300 ease-in-out ${show ? "rotate-180" : ""}`}
          />
        </div>
      </div>
      {show && (
        <>
          <InnerContainer className="w-full max-h-[80vh]">
            {loading && (
              <div className="w-full absolute grid place-items-center h-full bg-black/25 z-30">
                <LoadingIconBright width={30} height={30} />
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
                    className="text-custom-dark-text text-sm font-semibold hover:opacity-70 duration-200"
                  >
                    {memberID}
                  </Link>
                  <h4 className="text-custom-grey-text text-xs">
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
          <HRow className="mt-2" />
          <div className="w-full flex items-center justify-end mt-2 gap-2">
            <PrimaryButton className="text-sm w-fit" onClick={massAccept}>
              Accept all
            </PrimaryButton>
            <SecondaryButton
              className="border-custom-red text-custom-red py-1 text-sm w-fit self-stretch"
              onClick={massReject}
            >
              Reject All
            </SecondaryButton>
          </div>
        </>
      )}
    </DefaultCard>
  );
}
