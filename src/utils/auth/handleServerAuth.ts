"use server";

import { dbHandler } from "@/src/firebase/db";
import { cookies } from "next/headers";
import handleResponses from "../helpers/handleResponses";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { userDetailsType } from "@/src/components/auth/SignupForm";
import getCurrentDate from "../helpers/getCurrentDate";
import { initWaitListee } from "../schemas/waitlist";
import { getAuth } from "firebase/auth";
import { authHandler } from "@/src/firebase/auth";
import { FIREBASE_APP } from "@/src/firebase/config";
import { userLoginType } from "@/src/components/auth/SigninForm";
import { COOKIE_LIFESPAN } from "../settings";

export async function handleServerSignUp({
  groupID,
  memberID,
  userDetails,
}: {
  groupID: string;
  memberID: string;
  userDetails: userDetailsType;
}) {
  try {
    // check if member is already in group
    const res = await dbHandler.get({
      col_name: "GROUPS",
      id: groupID,
    });
    if (!res.data) throw new Error("invalid-group");

    // check if user has already requested to join group
    const resA = await dbHandler.get({
      col_name: `GROUPS/${groupID}/WAITLIST`,
      id: memberID,
    });

    if (resA.status)
      throw new Error(
        `Your request to ${groupID} is already pending. Please update your commander.`
      );

    // see if member is alrdy inside group
    const resB = await dbHandler.get({
      col_name: `GROUPS/${groupID}/MEMBERS`,
      id: memberID,
    });

    if (resB.data)
      throw new Error(
        "You already have an account under this Admin ID. Please sign in instead."
      );

    // new member
    const to_add = initWaitListee({
      memberID: memberID,
      groupID: groupID,
      displayName: userDetails.name.trim(),
      password: userDetails.password,
      dateRequested: getCurrentDate(),
    });

    const { error } = await dbHandler.add({
      col_name: `/GROUPS/${groupID}/WAITLIST`,
      id: memberID,
      to_add: to_add,
    });
    if (error) throw new Error(error);
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function handleServerSignIn({
  email,
  userDetails,
  memberID,
}: {
  memberID: string;
  email: string;
  userDetails: userLoginType;
}) {
  try {
    // sign in to firebase
    const auth = getAuth(FIREBASE_APP);
    const res = await authHandler.signIn(auth, email, userDetails.password);

    if (!res.status) throw new Error(res.error);

    const resA = await dbHandler.edit({
      col_name: `MEMBERS`,
      data: { password: userDetails.password },
      id: memberID,
    });

    if (!resA.status) throw new Error(resA.error);
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function addMemberUIDCookie(id: string) {
  try {
    const {
      data: { uid, memberID },
      error,
    } = await dbHandler.get({ col_name: "MEMBERS-UID", id });
    if (error) throw new Error(error);

    await addAuthToCookies({ uid });
    return handleResponses({ data: memberID });
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function linkUIDtoMember(uid: string, memberID: string) {
  try {
    const { error } = await dbHandler.add({
      col_name: "MEMBERS-UID",
      id: uid,
      to_add: { uid, memberID },
    });
    if (error) throw new Error(error);
    await addAuthToCookies({ uid });
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}

export async function addAuthToCookies({ uid }: { uid: string }) {
  const cookieStore = cookies();
  cookieStore.set("uid", uid, { maxAge: COOKIE_LIFESPAN });
}

export type AuthUserTypeA = {
  uid: string;
  memberID: string;
};

export type AuthUserType = {
  user: null | AuthUserTypeA;
  isAuthenticated: boolean;
  error: any;
};

export async function getMemberAuthServer() {
  let res = {
    user: null,
    isAuthenticated: false,
    error: null,
  } as AuthUserType;
  try {
    const cookieStore = cookies();
    const data = cookieStore.get("uid");
    if (!data) return res;
    const {
      data: { uid, memberID },
      error,
    } = await dbHandler.get({ col_name: "MEMBERS-UID", id: data.value });
    if (error) throw new Error(error);
    res = { ...res, user: { memberID, uid }, isAuthenticated: true };
    return res;
  } catch (err: any) {
    return res;
  }
}

export async function clearCookies() {
  const cookieStore = cookies();
  // clear all cookies from session
  const cookieNames = cookieStore.getAll();
  cookieNames.forEach((cookie: RequestCookie) => {
    cookieStore.delete(cookie.name);
  });
  console.log("Cleared all cookies.");
}
