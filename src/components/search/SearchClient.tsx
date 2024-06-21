"use client";

import React from "react";
import FormInputContainer from "../utils/FormInputContainer";
import { useQueryMember } from "@/src/hooks/members/useQueryMember";
import { getMembersData } from "@/src/utils/members/SetStatistics";
import Link from "next/link";
import ErrorSection from "../utils/ErrorSection";
import LoadingIcon from "../utils/LoadingIcon";
import DefaultCard from "../DefaultCard";
import { contentfulImageLoader } from "../profile/edit/ProfilePicSection";
import Image from "next/image";

export default function SearchClient() {
  const { filtered, query, setQuery, filteredObj, isLoading } = useQueryMember({
    fetchFunction: getMembersData,
    secondaryKey: "displayName",
  });

  return (
    <form>
      <FormInputContainer inputName="name" labelText="Search">
        <input
          name="name"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </FormInputContainer>
      {isLoading ? (
        <ErrorSection>
          <LoadingIcon height={30} width={30} />
        </ErrorSection>
      ) : query === "" ? (
        <ErrorSection>
          <p className="text-xs text-custom-grey-text">Let's find someone!</p>
        </ErrorSection>
      ) : query !== "" && filtered.length === 0 ? (
        <ErrorSection>
          <p className="text-xs text-custom-grey-text">
            No member matches that search!
          </p>
        </ErrorSection>
      ) : (
        <div className="w-full flex flex-col items-start justify-start gap-2 mt-4">
          {Object.keys(filteredObj).map((id: string, index: number) => {
            const { displayName, rank, pfp } = filteredObj[id];
            const name = `${rank} ${displayName}`.trim();
            return (
              <Link
                key={index}
                href={`/members/${id}`}
                className="w-full text-custom-dark-text hover:opacity-70 duration-150"
              >
                <DefaultCard className="py-2 px-3">
                  <div className="flex items-center justify-start gap-2">
                    <div className="w-[45px] h-[45px] overflow-hidden rounded-full shadow-lg relative flex items-center justify-center">
                      <Image
                        loader={contentfulImageLoader}
                        fill
                        sizes="100%"
                        src={pfp ? pfp : "/icons/icon_avatar.svg"}
                        alt="Profile"
                        className="object-cover drop-shadow-md z-10 overflow-hidden"
                      />
                    </div>
                    <div>
                      <p className="font-bold">{name}</p>
                      <p className="text-xs text-custom-grey-text">{id}</p>
                    </div>
                  </div>
                </DefaultCard>
              </Link>
            );
          })}
        </div>
      )}
    </form>
  );
}
