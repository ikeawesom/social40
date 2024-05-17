import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from "firebase/auth";
import handleResponses from "../utils/helpers/handleResponses";
import { FIREBASE_APP } from "./config";

class AuthClass {
  constructor() {}

  async signIn(auth: Auth, email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = email.split("@")[0];

      return handleResponses({ data: user });
    } catch (error: any) {
      return handleResponses({ status: false, error: error.message });
    }
  }

  async signUp(auth: Auth, email: string, password: string) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = email.split("@")[0];

      return handleResponses({ data: user });
    } catch (error: any) {
      return handleResponses({ status: false, error: error.message });
    }
  }

  async signOutUser(auth: Auth) {
    try {
      await signOut(auth);
      return handleResponses();
    } catch (error: any) {
      return handleResponses({ error: error.message, status: false });
    }
  }

  async changePassword(password: string) {
    try {
      const auth = getAuth(FIREBASE_APP);
      const curUser = auth.currentUser;
      if (!curUser) throw new Error("User not found");

      await updatePassword(curUser, password);
      return handleResponses();
    } catch (error: any) {
      return handleResponses({ error: error.message, status: false });
    }
  }
}

export const authHandler = new AuthClass();
