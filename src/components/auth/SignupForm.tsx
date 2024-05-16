"use client";
import React, { useState } from "react";
import PrimaryButton from "../utils/PrimaryButton";
import { dbHandler } from "@/src/firebase/db";
import { initWaitListee } from "@/src/utils/schemas/waitlist";
import getCurrentDate from "@/src/utils/helpers/getCurrentDate";
import { GROUP_MEMBERS_SCHEMA } from "@/src/utils/schemas/groups";
import { LoadingIconBright } from "../utils/LoadingIcon";

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

  const groupIDtrimmed = userDetails.admin.trim().toLowerCase();
  const nameTrimmed = userDetails.name
    .trim()
    .toLowerCase()
    .split(" ")
    .join("-");
  const username = `${groupIDtrimmed}-${nameTrimmed}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await dbHandler.get({
        col_name: "GROUPS",
        id: groupIDtrimmed,
      });

      if (!res.data) throw new Error("invalid-group");

      const resA = await dbHandler.get({
        col_name: `GROUPS/${groupIDtrimmed}/WAITLIST`,
        id: username,
      });

      if (resA.status)
        throw new Error(
          `Your request to ${groupIDtrimmed} is already pending. Please update your commander.`
        );

      // see if member inside group
      const resB = await dbHandler.get({
        col_name: `GROUPS/${groupIDtrimmed}/MEMBERS`,
        id: username,
      });

      if (resB.data)
        throw new Error(
          "You already have an account under this Admin ID. Please sign in instead."
        );

      // new member
      const to_add = initWaitListee({
        memberID: username,
        groupID: groupIDtrimmed,
        displayName: userDetails.name.trim(),
        password: userDetails.password,
        dateRequested: getCurrentDate(),
      });

      await dbHandler.add({
        col_name: `/GROUPS/${groupIDtrimmed}/WAITLIST`,
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
      <span className="min-[500px]:w-[400px] w-[85vw]">
        <input
          required
          type="text"
          name="name"
          placeholder="Enter your name"
          onChange={handleChange}
        />
        <p className="text-gray-400 text-sm mt-2">
          Username: <span className="font-bold">{username}</span>
        </p>
      </span>
      <input
        required
        type="password"
        name="password"
        placeholder="Choose a password"
        minLength={8}
        onChange={handleChange}
      />

      <PrimaryButton
        type="submit"
        className="grid place-items-center"
        disabled={loading}
      >
        {loading ? <LoadingIconBright height={20} width={20} /> : "Sign up"}
      </PrimaryButton>
    </form>
  );
}
