"use client";
import { onAuthStateChanged } from "firebase/auth/cordova";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { FIREBASE_APP } from "../firebase/config";
import { authHandler } from "../firebase/auth";
import { useHostname } from "../hooks/useHostname";
import handleResponses from "../utils/helpers/handleResponses";
import { GetPostObj } from "../utils/API/GetPostObj";

type AuthContextType = {
  memberID: string | null;
  setMember: React.Dispatch<React.SetStateAction<string | null>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { host } = useHostname();
  const [memberID, setMember] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(FIREBASE_APP);
    onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        console.log("logged in");
        const pathname = window.location.pathname;
        const localMemberID = localStorage.getItem("localMemberID");
        setMember(localMemberID);

        try {
          if (localMemberID) {
            const postObj = GetPostObj({
              uid: userAuth.uid,
              memberID: localMemberID,
            });
            const res = await fetch(`${host}/api/auth/handle-uid`, postObj);
            const body = await res.json();
            if (!body.status) throw new Error(body.error);
            // localStorage.removeItem("localMemberID");
          } else {
            console.log("no localstorage found");
            const postObj = GetPostObj({
              uid: userAuth.uid,
            });
            const res = await fetch(
              `${host}/api/auth/handle-uid-member`,
              postObj
            );
            const body = await res.json();
            if (!body.status) throw new Error(body.error);
            localStorage.setItem("localMemberID", body.data);
            setMember(body.data);
            console.log("set member in localstorage");
          }
          if (pathname.includes("auth")) {
            router.push("/home", { scroll: false });
          }
        } catch (err: any) {
          console.log("UID ERROR:", err.message);
          await handleSignOut();
          const route = `/auth?${new URLSearchParams({
            new_user: "false",
          })}`;
          setMember("");
          await clearCookies(host);
          router.push(route, { scroll: false });
        }
      } else {
        console.log("signed out");
        const route = `/auth?${new URLSearchParams({
          new_user: "false",
        })}`;
        setMember("");
        await clearCookies(host);
        router.push(route, { scroll: false });
      }
    });
  }, [host, router, memberID]);

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

export async function clearCookies(host: string) {
  const postObj = GetPostObj({});
  await fetch(`${host}/api/auth/clear`, postObj);
}
