"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useNavigation from "@/src/hooks/useNavigation";

const NAV_LINKS = [
  {
    title: "Home",
    icon: "icon_home.svg",
    active: "icon_home_active.svg",
    link: "/",
  },
  {
    title: "Search",
    icon: "icon_search.svg",
    active: "icon_search_active.svg",
    link: "/search",
  },
  {
    title: "Groups",
    icon: "icon_group.svg",
    active: "icon_group_active.svg",
    link: "/groups",
  },
  {
    title: "Profile",
    icon: "icon_profile.svg",
    active: "icon_profile_active.svg",
    link: "/profile",
  },
];
export default function Navbar() {
  const router = useRouter();

  const { pathname, setPathname } = useNavigation();

  const handleNav = (path: string) => {
    setPathname(path);
    router.push(path);
  };

  return (
    <div className="w-full bg-white shadow-custom-top absolute bottom-0 left-0 grid place-items-center">
      <div className="flex items-center justify-around max-w-[500px] w-full">
        {NAV_LINKS.map((item, index) => (
          <button
            onClick={() => handleNav(item.link)}
            key={index}
            className="flex flex-col gap-1 items-center justify-center py-2"
          >
            <Image
              src={
                pathname !== item.link
                  ? `icons/navigation/${item.icon}`
                  : `icons/navigation/${item.active}`
              }
              height={20}
              width={20}
              alt={item.title}
            />
            <h4
              className={`text-xs ${
                pathname !== item.link
                  ? "text-custom-dark-text"
                  : "text-custom-primary"
              }`}
            >
              {item.title}
            </h4>
          </button>
        ))}
      </div>
    </div>
  );
}
