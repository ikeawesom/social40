import { BADGE_SCHEMA } from "@/src/utils/schemas/members";
import React from "react";
import Badge from "../utils/Badge";

export default function MemberBadges({ badges }: { badges: BADGE_SCHEMA[] }) {
  const empty = badges.length === 0;
  if (!empty)
    return (
      <div className="flex items-center justify-start gap-3">
        {badges.map((item) => (
          <Badge
            key={item.name}
            backgroundColor={item.colors.bg}
            textColor={item.colors.text}
            noBorder
          >
            {item.name}
          </Badge>
        ))}
      </div>
    );
}
