"use client";
import { onAuthStateChanged } from "firebase/auth/cordova";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { FIREBASE_APP } from "../firebase/config";
import { authHandler } from "../firebase/auth";
import handleResponses from "../utils/helpers/handleResponses";
import {
  addMemberUIDCookie,
  clearCookies,
  linkUIDtoMember,
} from "../utils/auth/handleServerAuth";

type AuthContextType = {
  memberID: string | null;
  setMember: React.Dispatch<React.SetStateAction<string | null>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [memberID, setMember] = useState<string | null>(null);

  const noUserRoute = `/auth?${new URLSearchParams({
    new_user: "false",
  })}`;

  useEffect(() => {
    const auth = getAuth(FIREBASE_APP);
    onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        console.log("logged in");
        const { uid } = userAuth;
        const localMemberID = localStorage.getItem("localMemberID");

        try {
          if (localMemberID) {
            console.log("local storage found, just signed in");
            setMember(localMemberID);
            const { error } = await linkUIDtoMember(uid, localMemberID);
            if (error) throw new Error(error);
            localStorage.removeItem("localMemberID");
          } else {
            console.log("no localstorage found, returning member");
            const { error, data } = await addMemberUIDCookie(uid);
            if (error) throw new Error(error);
            console.log("got memberID from UID");
            setMember(data);
          }
        } catch (err: any) {
          console.log("UID ERROR:", err.message);
          await handleSignOut();
          setMember("");
          await clearCookies();
        }
      } else {
        console.log("signed out");
        setMember("");
        await clearCookies();
      }
    });
  }, [router, memberID]);

  useEffect(() => {
    if (memberID === "") {
      console.log("no memberID in context");
      router.push(noUserRoute, { scroll: false });
    } else if (memberID !== null) {
      console.log("from auth page, redirecting...");
      const pathname = window.location.pathname;
      if (pathname.includes("auth")) router.push("/home", { scroll: false });
    }
  }, [memberID]);

  return (
    <AuthContext.Provider value={{ memberID, setMember }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
}

export async function handleSignOut() {
  try {
    const auth = getAuth(FIREBASE_APP);
    await authHandler.signOutUser(auth);
    return handleResponses();
  } catch (err: any) {
    return handleResponses({ error: err.message, status: false });
  }
}
