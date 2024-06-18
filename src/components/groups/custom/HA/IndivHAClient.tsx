"use client";

import DefaultCard from "@/src/components/DefaultCard";
import HRow from "@/src/components/utils/HRow";
import { DateToString } from "@/src/utils/helpers/getCurrentDate";
import { DailyHAType } from "@/src/utils/schemas/ha";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";

export default function IndivHAClient({
  members,
  isHA,
}: {
  members: { [id: string]: DailyHAType };
  isHA?: boolean;
}) {
  const [show, setShow] = useState(true);
  const size = Object.keys(members).length;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 w-full">
        <h1 className="text-lg font-bold text-custom-dark-text">
          {isHA ? `HA Personnel (${size})` : `Non-HA Personnel (${size})`}
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
        <div className="w-full flex flex-col items-start justify-start gap-2 mt-2">
          {Object.keys(members).map((id: string) => {
            const { isHA, lastUpdated, memberID } = members[id];
            const updatedTiming = new Date(lastUpdated.seconds * 1000);
            return (
              <Link
                scroll={false}
                href={`/members/${memberID}`}
                key={memberID}
                className="w-full"
              >
                <DefaultCard className="w-full py-2 hover:bg-custom-light-text duration-150">
                  <div className="w-full flex-col items-start justify-center">
                    <h1 className="text-start font-bold">{memberID}</h1>
                    {isHA ? (
                      <span className="text-sm font-bold text-custom-green flex items-center justify-start gap-0">
                        HA Certified{" "}
                        <Image
                          alt="tick"
                          src="/icons/icon_tick_green.svg"
                          width={25}
                          height={25}
                          className="-translate-y-[0.5px]"
                        />
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-custom-red flex items-center justify-start gap-0">
                        Not HA
                        <Image
                          alt=""
                          src="/icons/features/icon_cross_red.svg"
                          width={25}
                          height={25}
                          className="-translate-y-[0.5px]"
                        />
                      </span>
                    )}
                    <p className="text-start text-sm text-custom-grey-text">
                      Last updated: {DateToString(updatedTiming)}
                    </p>
                  </div>
                </DefaultCard>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
