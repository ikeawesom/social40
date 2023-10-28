"use client";
import { onAuthStateChanged } from "firebase/auth/cordova";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { FIREBASE_APP } from "../firebase/config";
import { authHandler } from "../firebase/auth";
import { cookies } from "next/headers";
import { useHostname } from "../hooks/useHostname";
import { clearCookies } from "../utils/clearCookies";

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
        const fetchedMemberID = await fetch(`${host}/api/auth`);
        const data = (await fetchedMemberID.json()) as string;

        console.log("cookie:", data);

        const pathname = window.location.pathname;

        if (pathname.includes("auth")) {
          router.push("/");
        } else {
          if (!data) {
            const auth = getAuth(FIREBASE_APP);
            await authHandler.signOutUser(auth);
          } else {
            setMember(data);
          }
        }
      } else {
        console.log("signed out");
        const cur_member = memberID;

        const route = `/auth?${new URLSearchParams({
          new_user: cur_member ? "false" : "true",
        })}`;

        setMember(null);
        await clearCookies(host);

        router.push(route, { scroll: false });
      }
    });
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
