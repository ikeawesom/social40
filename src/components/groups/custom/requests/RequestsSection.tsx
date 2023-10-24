import React, { useState } from "react";
import DefaultCard from "../../../DefaultCard";
import Image from "next/image";
import RequestedUser from "./RequestedUser";
import { WaitListData } from "@/src/hooks/groups/custom/requests/useGroupRequests";
import LoadingIcon from "@/src/components/utils/LoadingIcon";
import { OnboardGroupMember } from "@/src/utils/onboarding/OnboardGroupMember";
import { OnboardNewMember } from "@/src/utils/onboarding/OnboardNewMember";
import { toast } from "sonner";
import { dbHandler } from "@/src/firebase/db";
import InnerContainer from "@/src/components/utils/InnerContainer";

export default function RequestsSection({
  data,
  groupID,
  reload,
}: {
  data: WaitListData;
  groupID: string;
  reload: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async (
    memberID: string,
    groupID: string,
    displayName: string,
    password: string | undefined
  ) => {
    const email = memberID + "@digital40sar.com";

    setLoading(true);
    try {
      // check if new user
      const newMemberStatus = await dbHandler.get({
        col_name: "MEMBERS",
        id: memberID,
      });

      if (!newMemberStatus.status) {
        // new user
        console.log("New member. Preparing to register");
        const onboardMemberStatus = await OnboardNewMember({
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
      const onboardGroupStatus = await OnboardGroupMember({
        groupID,
        memberID,
        role: "member",
      });

      if (!onboardGroupStatus.status) throw new Error(onboardGroupStatus.error);
      console.log("Onboarded group member.");
      toast.success(`Added ${memberID}.`);
      if (reload) reload(true);
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const handleReject = async (groupID: string, memberID: string) => {
    setLoading(true);
    try {
      const res = await dbHandler.delete({
        col_name: `GROUPS/${groupID}/WAITLIST`,
        id: memberID,
      });

      if (!res.status) throw new Error(res.error);
      toast.success(`Rejected ${memberID}.`);
      if (reload) reload(true);
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
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
            className={`duration-300 ${show ? "rotate-180" : ""}`}
          />
        </div>
        {show && (
          <InnerContainer>
            {loading && (
              <div className="w-full absolute grid place-items-center h-full bg-black/25 z-30">
                <LoadingIcon width={30} height={30} />
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
        )}
      </div>
    </DefaultCard>
  );
}
