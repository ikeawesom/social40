"use client";

import React from "react";
import FormInputContainer from "../utils/FormInputContainer";
import { useQueryMember } from "@/src/hooks/members/useQueryMember";
import { getMembersData } from "@/src/utils/members/SetStatistics";
import ErrorSection from "../utils/ErrorSection";
import LoadingIcon from "../utils/LoadingIcon";
import BasicMemberCard from "./BasicMemberCard";

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
            return <BasicMemberCard member={filteredObj[id]} key={index} />;
          })}
        </div>
      )}
    </form>
  );
}
