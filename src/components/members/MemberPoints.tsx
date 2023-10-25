import React from "react";
import Image from "next/image";

export default function MemberPoints({ points }: { points: number }) {
  return (
    <div className="bg-custom-primary rounded-lg px-2 py-1 gap-1 flex items-center justify-center">
      <h4 className="text-custom-light-text">{points}</h4>
      <Image
        src="/icons/icon_coin.svg"
        alt="40SAR Points"
        height={20}
        width={20}
      />
    </div>
  );
}
