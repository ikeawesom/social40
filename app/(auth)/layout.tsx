import { redirect } from "next/navigation";

export default function NavLayout({ children }: { children: React.ReactNode }) {
  redirect("/");
}
