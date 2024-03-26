"use client";
import { GAME_TYPE } from "@/src/utils/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { removeGameToken } from "../profile/edit/gameToken";
import { twMerge } from "tailwind-merge";

export default function GameCard(config: { config: GAME_TYPE }) {
  const router = useRouter();
  const { comingSoon, id, img, title } = config.config;
  const handleRedirect = async () => {
    await removeGameToken();
    router.replace(`/game/${id}`);
  };

  return (
    <div
      onClick={handleRedirect}
      className={twMerge(
        "w-full sm:w-[200px] overflow-hidden aspect-video shadow-sm grid place-items-center relative rounded-lg group",
        !comingSoon && "cursor-pointer"
      )}
    >
      <Image
        src={img}
        width={200}
        height={200}
        alt={id}
        className={twMerge(
          "scale-[180%] duration-150",
          !comingSoon && "group-hover:scale-[200%]"
        )}
      />
      <div className="bg-black/50 absolute top-0 left-0 w-full h-full grid place-items-center">
        <h1 className="font-bold text-custom-light-text text-xl">{title}</h1>
      </div>
    </div>
  );
}
