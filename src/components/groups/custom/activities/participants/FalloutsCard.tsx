"use client";
import DefaultCard from "@/src/components/DefaultCard";
import React, { useState } from "react";
import Image from "next/image";
import { FALLOUTS_SCHEMA } from "@/src/utils/schemas/activities";
import InnerContainer from "@/src/components/utils/InnerContainer";
import QueryInput from "@/src/components/utils/QueryInput";
import useQueryObj from "@/src/hooks/useQueryObj";

export default function FalloutsCard({
  fallouts,
}: {
  fallouts: { [memberID: string]: FALLOUTS_SCHEMA };
}) {
  const [show, setShow] = useState(false);

  const { handleSearch, itemList, search } = useQueryObj({
    obj: fallouts,
  });

  return (
    <DefaultCard className="w-full">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-custom-dark-text font-semibold text-start">
          Fallouts ( {Object.keys(itemList).length} )
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
          <QueryInput
            handleSearch={handleSearch}
            placeholder="Search for Member ID"
            search={search}
          />
          <InnerContainer className="w-full max-h-[60vh]">
            {Object.keys(itemList).map((id: string) => {
              const { memberID, reason, verifiedBy, displayName } = itemList[
                id
              ] as FALLOUTS_SCHEMA;
              return (
                <div
                  key={memberID}
                  className="w-full flex flex-col items-start justify-center py-2 px-3 duration-150 hover:bg-custom-light-text"
                >
                  <h1 className="text-custom-dark-text font-semibold text-sm">
                    {displayName}
                  </h1>
                  {/* <p className="text-xs text-custom-grey-text">{memberID}</p> */}
                  <p className="text-xs text-custom-grey-text">{reason}</p>
                  <p className="text-xs text-custom-grey-text">
                    Verified by: {verifiedBy}
                  </p>
                </div>
              );
            })}
          </InnerContainer>
        </>
      )}
    </DefaultCard>
  );
}
