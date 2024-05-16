import { authHandler } from "@/src/firebase/auth";
import { FIREBASE_APP, SECONDARY_FIREBASE_APP } from "@/src/firebase/config";
import { getAuth, updatePassword } from "firebase/auth";
import handleResponses from "../helpers/handleResponses";

export default async function resetPassword(
  username: string,
  password: string,
  newPassword: string
) {
  const email = `${username}@digital40sar.com`;

  try {
    const auth = getAuth(SECONDARY_FIREBASE_APP);
    const res = await authHandler.signIn(auth, email, password);
    if (!res.status) throw new Error(res.error);

    // change password
    const selectedUser = auth.currentUser;
    if (!selectedUser) throw new Error("User not found");
    await updatePassword(selectedUser, newPassword);

    const authA = getAuth(FIREBASE_APP);
    const curUser = authA.currentUser;
    if (curUser?.uid !== selectedUser?.uid) {
      // sign out selected user
      const resA = await authHandler.signOutUser(auth);
      if (!resA.status) throw new Error(resA.error);
    }
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ status: false, error: err.message });
  }
}
