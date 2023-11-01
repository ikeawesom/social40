import Navbar from "@/src/components/navigation/Navbar";

export default function NavLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mb-16 mt-8">{children}</div>
      <Navbar />
    </>
  );
}
