"use client";

import { createContext, useContext, useState } from "react";

type BiboContextType = {
  clientBibo: boolean | null;
  setClientBibo: React.Dispatch<React.SetStateAction<boolean | null>>;
};

const BiboContext = createContext<BiboContextType | null>(null);

export function BiboProvider({ children }: { children: React.ReactNode }) {
  const [clientBibo, setClientBibo] = useState<boolean | null>(null);

  return (
    <BiboContext.Provider value={{ clientBibo, setClientBibo }}>
      {children}
    </BiboContext.Provider>
  );
}

export function useBiboCtx() {
  const context = useContext(BiboContext);
  if (!context) {
    throw new Error("useBiboCtx must be used within an BiboCTXProvider");
  }
  return context;
}
