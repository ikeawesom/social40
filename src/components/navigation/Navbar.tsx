"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useNavigation from "@/src/hooks/useNavigation";
import { useMemberID } from "@/src/hooks/useMemberID";

export default function Navbar() {
  const router = useRouter();

  const { pathname, setPathname } = useNavigation();
  const { memberID } = useMemberID();

  const NAV_LINKS = [
    {
      title: "Home",
      icon: "icon_home.svg",
      active: "icon_home_active.svg",
      link: "/home",
    },
    {
      title: "Search",
      icon: "icon_search_black.svg",
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
      link: `/members/${memberID}`,
    },
  ];

  const handleNav = (path: string) => {
    setPathname(path);
    router.push(path, { scroll: false });
  };

  return (
    <div className="w-full bg-white shadow-custom-top fixed bottom-0 left-0 grid place-items-center z-40">
      <div className="flex items-center justify-around max-w-[500px] w-full">
        {NAV_LINKS.map((item, index) => (
          <button
            onClick={() => handleNav(item.link)}
            key={index}
            className="flex flex-col gap-1 items-center justify-center py-2 hover:opacity-50 duration-150"
          >
            <Image
              src={
                pathname !== item.link
                  ? `/icons/navigation/${item.icon}`
                  : `/icons/navigation/${item.active}`
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
