"use client";
import { onAuthStateChanged } from "firebase/auth/cordova";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { FIREBASE_APP } from "../firebase/config";
import { authHandler } from "../firebase/auth";
import { useHostname } from "../hooks/useHostname";
import { clearCookies } from "../utils/clearCookies";
import handleResponses from "../utils/handleResponses";
import { toast } from "sonner";

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

        if (pathname.includes("auth")) {
          router.push("/home", { scroll: false });
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

export async function handleSignOut(host: string) {
  try {
    await fetch(`${host}/api/auth/clear`, {
      method: "POST",
    });
    const auth = getAuth(FIREBASE_APP);
    await authHandler.signOutUser(auth);

    await clearCookies(host);

    return handleResponses();
  } catch (err: any) {
    return handleResponses({ error: err.message, status: false });
  }
}
