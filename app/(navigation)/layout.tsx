import Navbar from "@/src/components/navigation/Navbar";

export default function NavLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mb-16 mt-14">{children}</div>
      <Navbar />
    </>
  );
}
