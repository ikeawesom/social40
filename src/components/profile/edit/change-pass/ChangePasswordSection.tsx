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
    <DefaultCard className="w-full">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-custom-dark-text font-semibold text-start">
          Change Password
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
          <ChangePasswordForm />
        </>
      )}
    </DefaultCard>
  );
}
