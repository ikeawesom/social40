import { getAuth } from "firebase/auth";
import { authHandler } from "../../firebase/auth";
import { SECONDARY_FIREBASE_APP } from "../../firebase/config";
import { dbHandler } from "../../firebase/db";
import { initMemberObject } from "../schemas/members";
import handleResponses from "../handleResponses";

export type OnboardMemberTypes = {
  email?: string;
  password?: string;
  memberID?: string;
  displayName?: string;
  role?: string;
};

export async function OnboardNewMember({
  email,
  password,
  memberID,
  displayName,
  role,
}: OnboardMemberTypes) {
  try {
    // register new user
    const registerStatus = await RegisterUser({ email, password });

    if (!registerStatus.status) throw new Error(registerStatus.error);

    // add member to DB
    const memberDBStatus = await AddMember({
      memberID,
      displayName,
      role: role ? role : "member",
      password,
    });

    if (!memberDBStatus.status) throw new Error(memberDBStatus.error);

    return handleResponses();
  } catch (err: any) {
    return handleResponses({ error: err.message, status: false });
  }
}

export async function AddMember({
  memberID,
  displayName,
  role,
  password,
}: OnboardMemberTypes) {
  if (memberID && displayName && role && password) {
    try {
      const to_add = initMemberObject({
        memberID,
        displayName,
        role: role,
        password,
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
    error: "MemberID, Display Name, Role or Password not provided!",
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
