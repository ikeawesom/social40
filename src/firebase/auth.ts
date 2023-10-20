import { FIREBASE_APP } from "./config";
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import handleResponses from "../utils/handleResponses";
import { MEMBER_SCHEMA } from "../utils/schemas/member";

class AuthClass {
  constructor() {}

  async signIn(auth: Auth, email: string, password: string) {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user as any as MEMBER_SCHEMA;

      return handleResponses({ data: user });
    } catch (error: any) {
      return handleResponses({ status: false, error: error.message });
    }
  }

  async signUp(auth: Auth, email: string, password: string) {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user as any as MEMBER_SCHEMA;

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
}

export const authHandler = new AuthClass();
