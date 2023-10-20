import Navbar from "@/src/components/navigation/Navbar";

export default function NavLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Navbar />
    </>
  );
}
