import { PokerProvider } from "@/src/contexts/PokerContext";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  if (!token) redirect("/home");
  return (
    <PokerProvider>
      <div className="w-full grid place-items-center">{children}</div>
    </PokerProvider>
  );
}
