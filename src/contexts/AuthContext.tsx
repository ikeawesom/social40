"use client";
import { User, onAuthStateChanged } from "firebase/auth/cordova";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClientCookiesProvider } from "./CookiesProvider";
import { useCookies } from "next-client-cookies";
import { getAuth } from "firebase/auth";
import { FIREBASE_APP } from "../firebase/config";
import { dbHandler } from "../firebase/db";
import { toast } from "sonner";

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
        try {
          const memberID = cookieStore.get("memberID");
          const res = await dbHandler.get({
            col_name: "MEMBERS",
            id: memberID,
          });

          if (!res.data) throw new Error(res.error);

          cookieStore.set("memberDetails", JSON.stringify(res.data));

          // redirect
          const pathname = window.location.pathname;
          if (pathname.includes("auth")) router.push("/");
        } catch (err: any) {
          console.log(err);
        }
        setUser(user);
      } else {
        setUser(null);

        const cur_user = cookieStore.get("memberDetails");

        const route = `/auth?${new URLSearchParams({
          new_user: cur_user ? "false" : "true",
        })}`;

        cookieStore.remove("memberDetails");

        router.push(route);
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
