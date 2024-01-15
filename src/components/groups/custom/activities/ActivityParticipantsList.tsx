"use client";
import HRow from "@/src/components/utils/HRow";
import InnerContainer from "@/src/components/utils/InnerContainer";
import LoadingIcon from "@/src/components/utils/LoadingIcon";
import Modal from "@/src/components/utils/Modal";
import QueryInput from "@/src/components/utils/QueryInput";
import useQueryObj from "@/src/hooks/useQueryObj";
import { TimestampToDateString } from "@/src/utils/getCurrentDate";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { toast } from "sonner";
import { useHostname } from "@/src/hooks/useHostname";
import { useRouter } from "next/navigation";

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
  const { handleSearch, itemList, search } = useQueryObj({
    obj: participantsData,
  });

  const route = `/members/${curMember}`;

  const handleKick = async () => {
    setLoading(true);
    try {
      const ActivityObj = GetPostObj({ activityID, memberID: curMember });
      const res = await fetch(`${host}/api/activity/group-leave`, ActivityObj);
      const body = await res.json();
      if (!body.status) throw new Error(body.error);
      router.refresh();
      router.back();
      setCurMember("");
      toast.success(`Kicked ${curMember} from activity`);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };
  return (
    <>
      {curMember !== "" && (
        <Modal className="min-[400px]:p-4">
          {loading ? (
            <div className="w-full grid place-items-center">
              <LoadingIcon height={50} width={50} />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between w-full">
                <h1 className="text-custom-dark-text font-semibold">
                  {curMember}
                </h1>
                <button
                  onClick={() => setCurMember("")}
                  className="hover:opacity-75 duration-200"
                >
                  <Image
                    src="/icons/icon_close.svg"
                    alt="Close"
                    width={15}
                    height={15}
                  />
                </button>
              </div>
              <HRow />
              <div className="flex flex-col items-center justify-start mt-2 gap-1">
                <Link
                  className="w-full p-2 text-sm rounded-lg hover:bg-custom-light-text duration-200"
                  href={route}
                >
                  View Profile
                </Link>
              </div>
              {admin && (
                <div className="flex flex-col items-center justify-start mt-2 gap-1">
                  <div
                    className="w-full p-2 text-sm rounded-lg hover:bg-custom-light-text duration-200"
                    onClick={handleKick}
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
      <InnerContainer className="w-full">
        {Object.keys(itemList).map((mem: string) => {
          const date = itemList[mem].dateJoined;
          const dateStr = TimestampToDateString(date);
          return (
            <div
              key={mem}
              onClick={() => {
                if (mem !== memberID) {
                  setCurMember(mem);
                } else {
                  router.push(`/members/${memberID}`);
                }
              }}
              className="cursor-pointer w-full flex flex-col items-start justify-center py-2 px-3 duration-200 hover:bg-custom-light-text"
            >
              <h1 className="text-custom-dark-text font-semibold">{mem}</h1>
              <h4 className="text-custom-grey-text text-sm">
                Participated on: {dateStr}
              </h4>
            </div>
          );
        })}
      </InnerContainer>{" "}
    </>
  );
}
