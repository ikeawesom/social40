import { FIREBASE_APP } from "./config";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import handleResponses from "../utils/handleResponses";
import { MEMBER_SCHEMA } from "../utils/schemas/member";

export const FIREBASE_AUTH = getAuth(FIREBASE_APP);

class AuthClass {
  constructor() {}

  async signIn(email: string, password: string) {
    try {
      const res = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const user = res.user as any as MEMBER_SCHEMA;

      return handleResponses({ data: user });
    } catch (error: any) {
      return handleResponses({ status: false, error: error.message });
    }
  }

  async signUp(email: string, password: string) {
    try {
      const res = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const user = res.user as any as MEMBER_SCHEMA;

      return handleResponses({ data: user });
    } catch (error: any) {
      return handleResponses({ status: false, error: error.message });
    }
  }

  async signOutUser() {
    try {
      await signOut(FIREBASE_AUTH);
      return handleResponses();
    } catch (error: any) {
      return handleResponses({ error: error.message, status: false });
    }
  }
}

export const authHandler = new AuthClass();
