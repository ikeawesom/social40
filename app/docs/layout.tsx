export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-white w-full lg:px-20 md:px-6 p-2">{children}</div>;
}
