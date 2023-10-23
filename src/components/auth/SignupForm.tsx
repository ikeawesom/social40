"use client";
import React, { useState } from "react";
import PrimaryButton from "../utils/PrimaryButton";
import { dbHandler } from "@/src/firebase/db";
import { initWaitListee } from "@/src/utils/schemas/waitlist";
import getCurrentDate from "@/src/utils/getCurrentDate";

type userDetailsType = {
  admin: string;
  password: string;
  name: string;
};

type statusType = {
  setStatus: React.Dispatch<React.SetStateAction<string>>;
};

export default function SignupForm({ setStatus }: statusType) {
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<userDetailsType>({
    admin: "",
    password: "",
    name: "",
  });

  const username = `${userDetails.admin}-${userDetails.name
    .split(" ")
    .join("-")
    .toLowerCase()}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await dbHandler.get({
        col_name: "GROUPS",
        id: userDetails.admin,
      });

      if (!res.data) throw new Error("invalid-group");

      const resA = await dbHandler.get({
        col_name: `GROUPS/${userDetails.admin}/WAITLIST`,
        id: username,
      });

      if (resA.status)
        throw new Error(
          `Your request to ${userDetails.admin} is already pending. Please update your commander.`
        );

      const to_add = initWaitListee({
        memberID: username,
        groupID: userDetails.admin,
        displayName: userDetails.name,
        password: userDetails.password,
        dateRequested: getCurrentDate(),
      });

      await dbHandler.add({
        col_name: `/GROUPS/${userDetails.admin}/WAITLIST`,
        id: username,
        to_add: to_add,
      });
      setStatus("success-signup");
    } catch (e: any) {
      setStatus(e.message);
    }
    setLoading(false);
  };

  return (
    <form
      className="flex flex-col gap-y-4 items-center justify-center w-full"
      onSubmit={handleSignup}
    >
      <input
        required
        type="text"
        name="name"
        placeholder="Enter your name"
        onChange={handleChange}
      />
      <input
        required
        type="password"
        name="password"
        placeholder="Choose a password"
        onChange={handleChange}
      />
      <span className="min-[500px]:w-[400px] w-[85vw]">
        <input
          required
          type="text"
          name="admin"
          placeholder="Admin ID"
          onChange={handleChange}
        />
        <p className="text-gray-400 text-sm mt-2">
          You can get this from your commanders.
        </p>
      </span>
      <PrimaryButton type="submit" disabled={loading}>
        {loading ? "Creating..." : "Sign up"}
      </PrimaryButton>
    </form>
  );
}
