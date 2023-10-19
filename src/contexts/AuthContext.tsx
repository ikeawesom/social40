"use client";
import { User, onAuthStateChanged } from "firebase/auth/cordova";
import { createContext, useContext, useEffect, useState } from "react";
import { FIREBASE_AUTH } from "../firebase/auth";
import { useRouter } from "next/navigation";
import { ClientCookiesProvider } from "./CookiesProvider";
import { useCookies } from "next-client-cookies";

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
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        const uid = user.uid;
        cookieStore.set("UID", uid);
        setUser(user);
      } else {
        setUser(null);
        const cur_user = cookieStore.get("UID");
        const route = `/auth?${new URLSearchParams({
          new_user: cur_user ? "false" : "true",
        })}`;
        router.push(route);
        cookieStore.remove("UID");
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
