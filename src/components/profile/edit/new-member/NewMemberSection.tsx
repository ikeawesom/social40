"use client";
import DefaultCard from "@/src/components/DefaultCard";
import HRow from "@/src/components/utils/HRow";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";
import React, { useState } from "react";
import CreateNewMemberForm from "./CreateNewMemberForm";
import Link from "next/link";
import Image from "next/image";

export default function NewMemberSection({
  memberData,
}: {
  memberData: MEMBER_SCHEMA;
}) {
  const [show, setShow] = useState(false);
  return (
    <DefaultCard className="w-full">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-custom-dark-text font-semibold text-start">
          Create New Member
        </h1>
        <Image
          src="/icons/icon_arrow-down.svg"
          width={30}
          height={30}
          alt="Show"
          onClick={() => setShow(!show)}
          className={`duration-300 ease-in-out ${show ? "rotate-180" : ""}`}
        />
      </div>
      {show && (
        <>
          <HRow />
          <CreateNewMemberForm memberData={memberData} />
        </>
      )}
    </DefaultCard>
  );
}
