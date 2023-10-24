import { getAuth } from "firebase/auth";
import { authHandler } from "../../firebase/auth";
import { SECONDARY_FIREBASE_APP } from "../../firebase/config";
import { dbHandler } from "../../firebase/db";
import { initMemberObject } from "../schemas/members";
import handleResponses from "../handleResponses";

type OnboardMemberTypes = {
  email?: string;
  password?: string;
  memberID?: string;
  displayName?: string;
  role?: "member" | "admin" | "owner";
};

export async function OnboardNewMember({
  email,
  password,
  memberID,
  displayName,
  role,
}: OnboardMemberTypes) {
  try {
    // simultaneous proccesses
    const res = await Promise.all([
      // register new user
      RegisterUser({ email, password }),

      // add member to DB
      AddMember({
        memberID,
        displayName,
        role: role ? role : "member",
      }),
    ]);

    // check for any errors
    res.forEach((res) => {
      if (!res.status) throw new Error(res.error);
    });

    return handleResponses();
  } catch (err: any) {
    return handleResponses({ error: err.message, status: false });
  }
}

export async function AddMember({
  memberID,
  displayName,
  role,
}: OnboardMemberTypes) {
  if (memberID && displayName && role) {
    try {
      const to_add = initMemberObject({
        memberID,
        displayName,
        role: role,
      });

      const resB = await dbHandler.add({
        col_name: "MEMBERS",
        id: memberID,
        to_add: to_add,
      });

      if (!resB.status) throw new Error(resB.error);
      return handleResponses({ data: to_add });
    } catch (err: any) {
      return handleResponses({ error: err.message, status: false });
    }
  }
  return handleResponses({
    error: "MemberID, Display Name or Role not provided!",
    status: false,
  });
}

export async function RegisterUser({ email, password }: OnboardMemberTypes) {
  // register user
  if (email && password) {
    try {
      const auth = getAuth(SECONDARY_FIREBASE_APP);
      const res = await authHandler.signUp(auth, email, password);
      if (!res.status) throw new Error(res.error);
      // sign out registerd user
      const resA = await authHandler.signOutUser(auth);
      if (!resA.status) throw new Error(resA.error);

      return handleResponses();
    } catch (err: any) {
      return handleResponses({ error: err.message, status: false });
    }
  }
  return handleResponses({
    error: "Email or password not provided!",
    status: false,
  });
}
