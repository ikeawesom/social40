import { BADGE_COLORS } from "@/src/utils/constants";
import { BADGE_SCHEMA } from "@/src/utils/schemas/members";
import React from "react";

export default function MemberBadges({ badges }: { badges: BADGE_SCHEMA[] }) {
  const empty = badges.length === 0;
  if (!empty)
    return (
      <ul className="flex items-center justify-start gap-3">
        {badges.map((item) => (
          <li
            key={item.index}
            className={`px-2 py-1 rounded-lg text-sm hover:brightness-90 ${
              BADGE_COLORS[item.name]
            }`}
          >
            {item.name}
          </li>
        ))}
      </ul>
    );
}
