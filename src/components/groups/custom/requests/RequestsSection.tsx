import React, { useState } from "react";
import DefaultCard from "../../../DefaultCard";
import Image from "next/image";
import RequestedUser from "./RequestedUser";
import { WaitListData } from "@/src/hooks/groups/custom/requests/useGroupRequests";
import { LoadingIconBright } from "@/src/components/utils/LoadingIcon";
import { toast } from "sonner";
import { dbHandler } from "@/src/firebase/db";
import InnerContainer from "@/src/components/utils/InnerContainer";
import { Onboarding } from "@/src/utils/onboarding";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import HRow from "@/src/components/utils/HRow";
import handleResponses from "@/src/utils/helpers/handleResponses";
import { handleReload } from "@/src/components/navigation/HeaderBar";
import { useRouter } from "next/navigation";

export default function RequestsSection({
  data,
  groupID,
  reload,
}: {
  data: WaitListData;
  groupID: string;
  reload: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { host } = useHostname();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const acceptLogic = async (
    memberID: string,
    groupID: string,
    displayName: string,
    password: string | undefined
  ) => {
    const email = memberID + "@digital40sar.com";

    try {
      // check if new user
      const newMemberStatus = await fetch(
        `${host}/api/profile/member`,
        GetPostObj({ memberID })
      );
      const newMemberData = await newMemberStatus.json();

      if (!newMemberData.status) {
        // new user
        console.log("New member. Preparing to register");
        const onboardMemberStatus = await Onboarding.Account({
          displayName,
          memberID,
          email,
          password,
          role: "member",
        });

        if (!onboardMemberStatus.status)
          throw new Error(onboardMemberStatus.error);
        console.log("Registed user.");
      }

      console.log("Preparing to onboard group member.");
      const onboardGroupStatus = await Onboarding.GroupMember({
        groupID,
        memberID,
        role: "member",
      });

      if (!onboardGroupStatus.status) throw new Error(onboardGroupStatus.error);
      console.log("Onboarded group member.");
      return handleResponses();
    } catch (error: any) {
      return handleResponses({ status: false, error: error.message });
    }
  };
  const handleAccept = async (
    memberID: string,
    groupID: string,
    displayName: string,
    password: string | undefined
  ) => {
    setLoading(true);
    try {
      const res = await acceptLogic(memberID, groupID, displayName, password);
      if (!res.status) throw new Error(res.error);
      toast.success(`Added ${memberID}.`);
      if (reload) reload(true);
      handleReload(router);
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const rejectLogic = async (groupID: string, memberID: string) => {
    try {
      const res = await dbHandler.delete({
        col_name: `GROUPS/${groupID}/WAITLIST`,
        id: memberID,
      });

      if (!res.status) throw new Error(res.error);
      return handleResponses();
    } catch (error: any) {
      return handleResponses({ status: false, error: error.message });
    }
  };

  const handleReject = async (groupID: string, memberID: string) => {
    setLoading(true);
    try {
      const res = await rejectLogic(groupID, memberID);
      if (!res.status) throw new Error(res.error);
      toast.success(
        `Rejected ${memberID}! Please wait a few seconds for changes to update.`
      );
      if (reload) reload(true);
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const massAccept = async () => {
    setLoading(true);
    try {
      const promisesList = Object.keys(data).map(async (mem: string) => {
        const res = await acceptLogic(
          mem,
          data[mem].groupID,
          data[mem].displayName,
          data[mem].password
        );
        if (!res.status)
          return handleResponses({ status: false, error: res.error });
        return handleResponses();
      });

      const promisesRes = await Promise.all(promisesList);

      promisesRes.forEach((item: any) => {
        if (!item.status) throw new Error(item.error);
      });
      toast.success("Successfully accepted all member requests");
      if (reload) reload(true);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
    handleReload(router);
  };

  const massReject = async () => {
    setLoading(true);
    try {
      const promisesList = Object.keys(data).map(async (mem: string) => {
        const res = await rejectLogic(data[mem].groupID, mem);
        if (!res.status)
          return handleResponses({ status: false, error: res.error });
        return handleResponses();
      });

      const promisesRes = await Promise.all(promisesList);

      promisesRes.forEach((item: any) => {
        if (!item.status) throw new Error(item.error);
      });
      toast.success(
        "Successfully rejected all member requests! Please wait a few seconds for changes to update."
      );
      if (reload) reload(true);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
    handleReload(router);
  };

  return (
    <DefaultCard className="py-2 px-3">
      <div className="flex flex-col items-center justify-start w-full">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-custom-dark-text font-semibold flex gap-1 items-center justify-start text-start">
            Requests
            <span className="bg-custom-red text-custom-light-text font-medium px-2 rounded-full text-sm text-center my-2">
              {Object.keys(data).length > 9 ? "9+" : Object.keys(data).length}
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
        {show && (
          <>
            <InnerContainer className="max-h-[60vh]">
              {loading && (
                <div className="w-full absolute grid place-items-center h-full bg-black/25 z-30">
                  <LoadingIconBright width={30} height={30} />
                </div>
              )}
              {Object.keys(data).map((item) => (
                <RequestedUser
                  accept={handleAccept}
                  reject={handleReject}
                  groupID={groupID}
                  className="py-2 px-3 rounded-none"
                  key={data[item].memberID}
                  data={data[item]}
                />
              ))}
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
      </div>
    </DefaultCard>
  );
}
