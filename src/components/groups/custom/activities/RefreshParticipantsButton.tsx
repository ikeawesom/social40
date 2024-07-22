"use client";

import SecondaryButton from "@/src/components/utils/SecondaryButton";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import HRow from "@/src/components/utils/HRow";
import { toast } from "sonner";
import { GROUP_ACTIVITY_SCHEMA } from "@/src/utils/schemas/group-activities";
import { useRouter } from "next/navigation";
import Modal from "@/src/components/utils/Modal";
import ModalHeader from "@/src/components/utils/ModalHeader";
import ModalLoading from "@/src/components/utils/ModalLoading";
import InnerContainer from "@/src/components/utils/InnerContainer";
import Notice from "@/src/components/utils/Notice";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import Link from "next/link";
import { createGroupActivityClass } from "@/src/utils/groups/createGroupActivityClass";
import { useMemberID } from "@/src/hooks/useMemberID";
import { GROUP_ACTIVITY_PARTICIPANTS } from "@/src/utils/constants";
import { DateToString } from "@/src/utils/helpers/getCurrentDate";
import { getNonHAMembers } from "../HA/getNonHAMembers";
import { second } from "@/src/utils/groups/handleGroupActivityCreate";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { useHostname } from "@/src/hooks/useHostname";
import { twMerge } from "tailwind-merge";
import { handleReload } from "@/src/components/navigation/HeaderBar";

export default function RefreshParticipantsButton({
  activityData,
  refreshed,
}: {
  refreshed: boolean;
  activityData: GROUP_ACTIVITY_SCHEMA;
}) {
  const router = useRouter();
  const { memberID } = useMemberID();
  const { host } = useHostname();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useHA, setUseHA] = useState({
    warning: false,
    loading: false,
  });
  const [nonHAmembers, setNonHAMembers] = useState<string[]>();
  const [toggle, setToggle] = useState<string>();

  useEffect(() => {
    if (toggle)
      sessionStorage.setItem("url", `${window.location.origin}${toggle}`);
  }, [toggle]);

  const {
    activityID,
    activityDate,
    activityDesc,
    activityLevel,
    activityTitle,
    groupID,
    isPT,
    needsHA,
  } = activityData;

  const tempDate = new Date(activityDate.seconds * 1000);
  const dateStr = DateToString(tempDate);

  const input = {
    title: activityTitle,
    desc: activityDesc,
    date: dateStr.split(" ")[0],
    time: dateStr.split(" ")[1],
    duration: {
      active: false,
      endDate: "",
      endTime: "",
    },
    restrict: false,
    level: activityLevel,
    pt: isPT,
    needHA: needsHA,
    refreshed: true,
  };

  const addMembers = {
    check: Object.keys(GROUP_ACTIVITY_PARTICIPANTS)[0],
    members: [] as string[],
  };

  const handleLogic = async () => {
    setLoading(true);
    try {
      const createGroupClass = new createGroupActivityClass({
        addMembers,
        groupID: groupID,
        input,
        memberID,
      });

      const { error: errA } = await createGroupClass.createGroupActivity();
      if (errA) throw new Error(errA);

      const { error: errB } = await createGroupClass.verifyMembers();
      if (errB) throw new Error(errB);

      if (needsHA) {
        createGroupClass.setNonHAMembers(nonHAmembers ?? []);
      }

      const { error: errC } = await createGroupClass.addParticipants();
      if (errC) throw new Error(errC);

      const { error: errD, data } = await createGroupClass.addToGroupCol();
      if (errD) throw new Error(errD);

      const ActivityObj = GetPostObj({ activityID, groupID });
      const res = await fetch(`${host}/api/activity/group-delete`, ActivityObj);
      const body = await res.json();

      if (!body.status) throw new Error(body.error);
      toast.success("Great, your changes will be updated in a few seconds.");

      const route = `/groups/${
        activityData.groupID
      }/activity?${new URLSearchParams({
        id: data,
      })}`;

      setToggle(route);
      router.refresh();
      handleReload(router);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
    setShow(false);
  };

  const handleRefresh = async () => {
    setShow(true);
    if (
      confirm(
        `Are you sure you want to refresh current participants?
- This will allow all valid participants within this group to join
- This will overwrite all current participation data
- You can only do this ONCE`
      )
    ) {
      if (input.needHA) {
        // show warning modal
        setUseHA({ warning: true, loading: true });

        // get filtered group members based on selection
        const { data: filtered, error: filterErr } = await second(
          addMembers,
          groupID
        );
        if (filterErr) throw new Error(filterErr);

        // filter who are not HA
        const { data, error } = await getNonHAMembers(filtered);
        if (error) throw new Error(error);

        if (Object.keys(data).length > 0) {
          // if have members not HA, display warning
          setNonHAMembers(Object.keys(data));
          setUseHA({ warning: true, loading: false });
        } else {
          // if no not HA, remove modal
          await handleLogic();
        }
      } else {
        await handleLogic();
      }
    } else {
      setShow(false);
    }
  };

  return (
    <>
      {show && (
        <Modal>
          <ModalHeader
            heading="Refresh Participants"
            close={
              loading
                ? undefined
                : () => {
                    setShow(false);
                  }
            }
          />
          {loading ? (
            <ModalLoading text="This might take a moment... Please do not or refresh this page." />
          ) : (
            useHA.warning &&
            (useHA.loading ? (
              <ModalLoading />
            ) : (
              <div className="flex flex-col items-start justify-start gap-3">
                <Notice status="error" noHeader>
                  <h1 className="font-bold">
                    WARNING: The following members are not Heat Acclimitised
                    (HA).
                  </h1>
                </Notice>
                <InnerContainer className="w-full max-h-[20vh]">
                  {nonHAmembers?.map((id: string, index: number) => (
                    <div
                      key={index}
                      className="text-sm w-full px-2 py-2 border-b-[1px] border-custom-light-text flex items-center justify-between gap-3"
                    >
                      <h1 className="font-bold text-custom-dark-text">{id}</h1>
                      <Link
                        scroll={false}
                        className="text-xs text-custom-primary underline hover:opacity-70"
                        href={`/members/${id}`}
                      >
                        View Profile
                      </Link>
                    </div>
                  ))}
                </InnerContainer>
                <div className="w-full flex items-start justify-center gap-2 flex-col">
                  <p className="text-sm text-custom-red text-center">
                    Due to safety reasons, these members will{" "}
                    <span className="font-bold">not</span> be added into the
                    activity.
                  </p>
                  <PrimaryButton onClick={handleLogic}>
                    Accept & Continue
                  </PrimaryButton>
                </div>
              </div>
            ))
          )}
        </Modal>
      )}
      <HRow />
      <SecondaryButton
        disabled={refreshed}
        onClick={handleRefresh}
        className={twMerge(
          "flex items-center justify-center gap-1",
          !refreshed && "border-custom-orange"
        )}
      >
        Refresh Participants{" "}
        <Image
          src="/icons/navigation/icon_reload.svg"
          alt="Reload"
          width={18}
          height={18}
        />
      </SecondaryButton>
      {refreshed && (
        <p className="text-xs text-custom-grey-text self-center text-center">
          You have already refreshed this activity.
        </p>
      )}
    </>
  );
}
