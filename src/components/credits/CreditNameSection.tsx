import { CreditsRoleType } from "@/src/utils/credits";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function CreditNameSection({
  member,
  small,
}: {
  member: CreditsRoleType;
  small?: boolean;
}) {
  const { displayName, role, memberID, substring } = member;
  return (
    <div className="flex-1 min-w-fit">
      {role && <p className="text-sm text-custom-grey-text">{role}</p>}
      <h1
        className={twMerge(
          "text-custom-dark-text font-bold",
          small ? "sm:text-lg" : "sm:text-2xl text-xl"
        )}
      >
        {displayName}
      </h1>
      {substring && <p className="text-custom-grey-text">{substring}</p>}
      {memberID && (
        <Link
          scroll={false}
          target="_blank"
          className="text-sm text-custom-primary duration-150 hover:opacity-70"
          href={`/members/${memberID}`}
        >
          @{memberID}
        </Link>
      )}
    </div>
  );
}
