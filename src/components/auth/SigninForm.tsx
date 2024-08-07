"use client";
import React, { useState } from "react";
import PrimaryButton from "../utils/PrimaryButton";
import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { LoadingIconBright } from "../utils/LoadingIcon";
import {
  clearCookies,
  handleServerSignIn,
} from "@/src/utils/auth/handleServerAuth";
import { FIREBASE_APP } from "@/src/firebase/config";
import { getAuth } from "firebase/auth";
import { authHandler } from "@/src/firebase/auth";

export type userLoginType = {
  email: string;
  password: string;
};

type statusType = {
  setStatus: React.Dispatch<React.SetStateAction<string>>;
};

export default function SigninForm({ setStatus }: statusType) {
  const router = useRouter();
  const { setMember } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<userLoginType>({
    email: "",
    password: "",
  });

  const username = userDetails.email.toLowerCase().trim();
  const emailMerged = `${username}@digital40sar.com`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // lowercase memberID (not case-sensitive)
      const memberID = username;
      localStorage.setItem("localMemberID", memberID);

      // sign in to firebase
      const auth = getAuth(FIREBASE_APP);
      const res = await authHandler.signIn(
        auth,
        emailMerged,
        userDetails.password
      );

      if (!res.status) throw new Error(res.error);

      // manage data on server
      const { error } = await handleServerSignIn({
        memberID: username,
        userDetails,
      });

      if (error) throw new Error(error);

      router.refresh();
      setMember(memberID);
    } catch (e: any) {
      await clearCookies();
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
      <PrimaryButton
        type="submit"
        className="grid place-items-center"
        disabled={loading}
      >
        {loading ? <LoadingIconBright height={20} width={20} /> : "Sign in"}
      </PrimaryButton>
    </form>
  );
}
