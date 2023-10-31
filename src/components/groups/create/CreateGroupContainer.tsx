"use client";
import React, { useState } from "react";
import PrimaryButton from "../../utils/PrimaryButton";
import CreateGroupForm from "../CreateGroupForm";

export default function CreateGroupContainer() {
  const [show, setShow] = useState(false);
  return (
    <>
      <PrimaryButton onClick={() => setShow(true)} className="w-fit mb-2">
        Create Group
      </PrimaryButton>
      {show && <CreateGroupForm closeModal={() => setShow(false)} />}
    </>
  );
}
