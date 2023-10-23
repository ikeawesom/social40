"use client";
import React, { useState } from "react";
import { authHandler } from "@/src/firebase/auth";

import PrimaryButton from "../utils/PrimaryButton";
import { getAuth } from "firebase/auth";
import { FIREBASE_APP } from "@/src/firebase/config";
import { dbHandler } from "@/src/firebase/db";
import { useAuth } from "@/src/contexts/AuthContext";
import { MEMBER_SCHEMA } from "@/src/utils/schemas/members";

type userDetailsType = {
  email: string;
  password: string;
};

type statusType = {
  setStatus: React.Dispatch<React.SetStateAction<string>>;
};

export default function SigninForm({ setStatus }: statusType) {
  const { setMember } = useAuth();

  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<userDetailsType>({
    email: "",
    password: "",
  });

  const emailMerged = `${userDetails.email.toLowerCase()}@digital40sar.com`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const auth = getAuth(FIREBASE_APP);
      const res = await authHandler.signIn(
        auth,
        emailMerged,
        userDetails.password
      );

      if (!res.status) throw new Error(res.error);
      const memberID = res.data;

      const resA = await dbHandler.get({ col_name: "MEMBERS", id: memberID });

      if (!resA.status) throw new Error(resA.error);
      const memberDetails = resA.data as MEMBER_SCHEMA;
      setMember(memberDetails.memberID);
    } catch (e: any) {
      setStatus(e.message as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSignin}
      className="flex flex-col gap-y-4 items-center justify-center w-full"
    >
      <div className="flex flex-col gap-4 w-full">
        <input
          required
          type="text"
          name="email"
          placeholder="Username"
          onChange={handleChange}
        />
        <input
          required
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
      </div>
      <PrimaryButton type="submit" disabled={loading}>
        {loading ? "Working..." : "Sign in"}
      </PrimaryButton>
    </form>
  );
}
