import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import handleResponses from "../utils/handleResponses";

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
}

export const authHandler = new AuthClass();
