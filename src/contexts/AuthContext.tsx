"use client";
import { onAuthStateChanged } from "firebase/auth/cordova";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { FIREBASE_APP } from "../firebase/config";

type AuthContextType = {
  memberID: string | null;
  setMember: React.Dispatch<React.SetStateAction<string | null>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [memberID, setMember] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(FIREBASE_APP);
    onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        const pathname = window.location.pathname;
        if (pathname.includes("auth")) router.push("/");
      } else {
        const cur_member = memberID;

        const route = `/auth?${new URLSearchParams({
          new_user: cur_member ? "false" : "true",
        })}`;

        setMember(null);
        router.push(route, { scroll: false });
      }
    });
  }, [setMember]);

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
