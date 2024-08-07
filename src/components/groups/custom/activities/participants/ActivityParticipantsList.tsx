"use client";
import LoadingIcon, {
  LoadingIconBright,
} from "@/src/components/utils/LoadingIcon";
import Modal from "@/src/components/utils/Modal";
import QueryInput from "@/src/components/utils/QueryInput";
import useQueryObj from "@/src/hooks/useQueryObj";
import Link from "next/link";
import React, { useState } from "react";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { toast } from "sonner";
import { useHostname } from "@/src/hooks/useHostname";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import PrimaryButton from "@/src/components/utils/PrimaryButton";
import ParticipantContainer from "./ParticipantContainer";
import { handleReload } from "@/src/components/navigation/HeaderBar";
import ModalHeader from "@/src/components/utils/ModalHeader";
import ModalLoading from "@/src/components/utils/ModalLoading";

export default function ActivityParticipantsList({
  participantsData,
  activityID,
  memberID,
  admin,
}: {
  participantsData: any;
  activityID: string;
  memberID: string;
  admin: boolean;
}) {
  const router = useRouter();
  const { host } = useHostname();
  const [loading, setLoading] = useState(false);
  const [curMember, setCurMember] = useState("");
  const [cfm, setCfm] = useState(false);
  const [fall, setFall] = useState({ status: false, reason: "" });
  const { handleSearch, itemList, search } = useQueryObj({
    obj: participantsData,
    type: "displayName",
  });

  const route = `/members/${curMember}`;

  const handleFallout = async (msg: string) => {
    setLoading(true);
    try {
      const ActivityObj = GetPostObj({
        activityID,
        memberID: curMember,
        fallReason: msg,
        verifiedBy: memberID,
      });
      const resA = await fetch(
        `${host}/api/activity/group-fallout`,
        ActivityObj
      );
      const bodyA = await resA.json();
      if (!bodyA.status) throw new Error(bodyA.error);
      await handleKick();
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const handleKick = async () => {
    setLoading(true);
    try {
      const ActivityObj = GetPostObj({
        activityID,
        memberID: curMember,
      });

      const res = await fetch(`${host}/api/activity/group-leave`, ActivityObj);
      const body = await res.json();
      if (!body.status) throw new Error(body.error);
      router.refresh();
      setCurMember("");
      toast.success(`Kicked ${curMember} from activity`);
      handleReload(router);
    } catch (err: any) {
      toast.error(err.message);
    }
    setCfm(false);
    setLoading(false);
  };

  return (
    <>
      {cfm && (
        <Modal className="min-[400px]:p-4">
          <ModalHeader
            close={() => setCfm(false)}
            heading={`Why are you kicking ${curMember}?`}
          />
          {loading ? (
            <div className="p-4 w-full grid place-items-center">
              <LoadingIcon height={30} width={30} />
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center justify-start mt-2 gap-1">
                <div
                  className={twMerge(
                    "w-full p-2 text-sm rounded-lg hover:bg-custom-light-text duration-150",
                    fall.status && "bg-custom-light-text"
                  )}
                  onClick={() => setFall({ ...fall, status: !fall.status })}
                >
                  Add a reason
                </div>
                {fall.status && (
                  <div className="w-full flex items-center justify-start gap-2 mb-2">
                    <input
                      type="text"
                      className="text-sm"
                      required
                      placeholder="e.g. RSI, Dizzy, etc."
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFall({ ...fall, reason: e.target.value })
                      }
                      value={fall.reason}
                    />
                    <PrimaryButton
                      onClick={async () => await handleFallout(fall.reason)}
                      disabled={loading}
                      type="submit"
                      className="w-fit grid place-items-center"
                    >
                      {loading ? (
                        <LoadingIconBright height={20} width={20} />
                      ) : (
                        "Submit"
                      )}
                    </PrimaryButton>
                  </div>
                )}
              </div>
              <div
                className="w-full p-2 text-sm rounded-lg hover:bg-custom-light-text duration-150"
                onClick={async () => await handleFallout("Others")}
              >
                Others
              </div>
            </>
          )}
        </Modal>
      )}
      {curMember !== "" && !cfm && (
        <Modal className="min-[400px]:p-4">
          {loading ? (
            <ModalLoading />
          ) : (
            <>
              <ModalHeader close={() => setCurMember("")} heading={curMember} />
              <div className="flex flex-col items-center justify-start mt-2 gap-1">
                <Link
                  scroll={false}
                  className="w-full p-2 text-sm rounded-lg hover:bg-custom-light-text duration-150"
                  href={route}
                >
                  View Profile
                </Link>
              </div>
              {admin && (
                <div className="flex flex-col items-center justify-start mt-2 gap-1">
                  <div
                    className="w-full p-2 text-sm rounded-lg hover:bg-custom-light-text duration-150"
                    onClick={() => setCfm(true)}
                  >
                    Kick From Activity
                  </div>
                </div>
              )}
            </>
          )}
        </Modal>
      )}
      <h1 className="text-custom-dark-text font-semibold">
        Participants ( {Object.keys(itemList).length} )
      </h1>
      <QueryInput
        handleSearch={handleSearch}
        placeholder="Search for Member ID"
        search={search}
      />
      <ParticipantContainer
        admin={admin}
        activityID={activityID}
        itemList={itemList}
        memberID={memberID}
        setCurMember={setCurMember}
      />
    </>
  );
}
