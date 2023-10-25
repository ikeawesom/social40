import { BADGE_SCHEMA } from "@/src/utils/schemas/members";
import React from "react";

export const BADGE_COLORS = {
  Gold: "bg-orange-300",
  Sharpshooter: "bg-green-300",
  Recon: "bg-blue-300",
} as { [key: string]: string };

export default function MemberBadges({ badges }: { badges: BADGE_SCHEMA[] }) {
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
