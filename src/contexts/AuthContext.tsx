"use client";
import { User, onAuthStateChanged } from "firebase/auth/cordova";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClientCookiesProvider } from "./CookiesProvider";
import { useCookies } from "next-client-cookies";
import { getAuth } from "firebase/auth";
import { FIREBASE_APP } from "../firebase/config";
import { dbHandler } from "../firebase/db";

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const cookieStore = useCookies();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth(FIREBASE_APP);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const res = await dbHandler.get({ col_name: "MEMBERS", id: uid });
        if (res.status) cookieStore.set("USER_DATA", JSON.stringify(res.data));

        setUser(user);

        // redirect
        const pathname = window.location.pathname;
        if (pathname.includes("auth")) router.replace("/");
      } else {
        setUser(null);

        const cur_user = cookieStore.get("USER_DATA");

        const route = `/auth?${new URLSearchParams({
          new_user: cur_user ? "false" : "true",
        })}`;

        router.push(route);

        cookieStore.remove("USER_DATA");
      }
    });
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
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
