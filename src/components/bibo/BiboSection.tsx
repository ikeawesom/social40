"use client";
import React, { useState } from "react";
import DefaultCard from "../DefaultCard";
import InnerContainer from "../utils/InnerContainer";
import BookSomeoneButton from "./BookSomeoneButton";
import { BIBO_DB_TYPE } from "@/src/utils/schemas/bibo";
import PrimaryButton from "../utils/PrimaryButton";
import Image from "next/image";
import { toast } from "sonner";
import { useHostname } from "@/src/hooks/useHostname";
import { GetPostObj } from "@/src/utils/API/GetPostObj";
import { LoadingIconBright } from "../utils/LoadingIcon";
import BiboDownloadButton from "./BiboDownloadButton";
import { useMemberID } from "@/src/hooks/useMemberID";

export default function BiboSection({ role }: { role: string }) {
  const [member, setMember] = useState("");
  const [loading, setLoading] = useState(false);
  const [biboData, setBiboData] = useState<BIBO_DB_TYPE>();
  const { host } = useHostname();
  const { memberID } = useMemberID();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const PostObj = GetPostObj({
        memberID: member,
        viewerRole: role,
        curMember: memberID,
      });
      const res = await fetch(`${host}/api/bibo/get`, PostObj);
      const body = await res.json();

      if (!body.status) throw new Error(body.error);

      setBiboData(body.data);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMember((member) => e.target.value);

  return (
    <DefaultCard>
      <div className="flex flex-col items-start justify-start gap-y-1 w-full">
        <h1 className="text-start font-semibold text-base">Book in Members</h1>
        <BookSomeoneButton />
        <p className="text-sm text-custom-grey-text">
          Enter a member ID below to view their BIBO spreadsheet.
        </p>
        <form
          className="flex w-full items-center justify-between gap-3 mb-1"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={member}
            onChange={handleChange}
            required
            placeholder="Enter a member ID here"
          />

          <PrimaryButton
            className="w-fit self-stretch px-2 grid place-items-center"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <LoadingIconBright width={25} height={25} />
            ) : (
              <Image
                src="/icons/navigation/icon_search.svg"
                alt="Search"
                height={25}
                width={25}
              />
            )}
          </PrimaryButton>
        </form>
        {biboData &&
          (Object.keys(biboData).length !== 0 ? (
            <BiboDownloadButton biboData={biboData} />
          ) : (
            <p className="text-start text-custom-grey-text text-xs">
              This member has yet to be booked in by commanders.
            </p>
          ))}
      </div>
    </DefaultCard>
  );
}

// (Object.keys(biboData).length === 0 ? (
//   <InnerContainer className="py-2 gap-4 max-h-[100vh]">
//     <p>Download BIBO spreadsheets below.</p>
//     {Object.keys(biboData).map((date: string) => (
//       <div>{date}</div>
//     ))}
//   </InnerContainer>
// ) : (
// <p className="text-start text-custom-grey-text text-xs">
//   This member has yet to be booked in by commanders.
// </p>
// ))
