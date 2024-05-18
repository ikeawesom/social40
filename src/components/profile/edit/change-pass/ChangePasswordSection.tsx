"use client";
import React, { useState } from "react";
import DefaultCard from "../../../DefaultCard";
import HRow from "../../../utils/HRow";
import ChangePasswordForm from "./ChangePasswordForm";
import Image from "next/image";
import Link from "next/link";

export default function ChangePasswordSection() {
  const [show, setShow] = useState(false);
  return (
    <DefaultCard className="w-full py-2 px-3">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center justify-start gap-2">
          <Image
            src="/icons/icon_lock.svg"
            width={25}
            height={25}
            alt=""
            onClick={() => setShow(!show)}
            className={`duration-300 ease-in-out ${show ? "rotate-180" : ""}`}
          />
          <h1 className="text-custom-dark-text font-semibold text-start text-sm">
            Change Password
          </h1>
        </div>
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
          <ChangePasswordForm />
        </>
      )}
    </DefaultCard>
  );
}
