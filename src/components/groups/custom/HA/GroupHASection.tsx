"use client";
import React, { useEffect, useState } from "react";
import { isHAType } from "./HAForm";
import { useRouter } from "next/navigation";
import DefaultCard from "@/src/components/DefaultCard";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import SecondaryButton from "@/src/components/utils/SecondaryButton";
import Image from "next/image";
import HRow from "@/src/components/utils/HRow";
import LoadingScreenSmall from "@/src/components/screens/LoadingScreenSmall";

export default function GroupHASection({ groupID }: { groupID: string }) {
  const router = useRouter();
  const [results, setResults] = useState<isHAType[]>([]);
  const [time, setTime] = useState({ from: "", to: "" });
  const [error, setError] = useState({ state: "loading", msg: "" });

  useEffect(() => {
    const localHA = localStorage.getItem("HA-results");
    if (!localHA) router.back();
    else {
      const HAResults = JSON.parse(localHA);

      if (groupID in HAResults) {
        setResults(HAResults[groupID].members);
        setTime(HAResults[groupID].time);
        setError({ ...error, state: "false" });
      } else {
        setError({
          state: "true",
          msg: "You have not calculated your HA for this group.",
        });
      }
    }
  }, []);
  const HApeople = results.filter((item: isHAType) => item.isHA);

  if (error.state === "loading") return <LoadingScreenSmall />;
  return (
    <>
      <div className="mt-4 w-full flex flex-col items-center justify-center gap-1 text-center">
        {error.state === "true" ? (
          <h1>{error.msg}</h1>
        ) : (
          <>
            <h1 className="text-xl">
              You have{" "}
              <span className="font-bold text-3xl text-custom-primary">
                {HApeople.length}
              </span>{" "}
              HA personnel.
            </h1>
            <p className="text-sm text-custom-grey-text">
              Calculated from: {time.from} <br /> Last updated: {time.to}
            </p>
          </>
        )}
        <SecondaryButton
          onClick={() => {
            router.push(`/groups/${groupID}`);
            router.refresh();
          }}
          className="flex items-center justify-center gap-1 mt-2"
        >
          {error.state === "true" ? "Calculate now" : "Re-calculate"}
          <Image
            alt=""
            src="/icons/features/icon_bolt_primary.svg"
            width={13}
            height={13}
          />
        </SecondaryButton>
      </div>
      <HRow />
      {results.map((item: isHAType, index: number) => {
        const { displayName, id, isHA } = item;
        return (
          <Link href={`/members/${id}`} key={index} className="w-full">
            <DefaultCard className="w-full duration-150 hover:bg-custom-light-text py-2 px-3">
              <h1 className={twMerge("font-bold", !isHA && "text-custom-red")}>
                {displayName}
              </h1>
              <p className="text-sm text-custom-grey-text">{id}</p>
            </DefaultCard>
          </Link>
        );
      })}
    </>
  );
}
