export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-white w-full lg:px-28 md:px-8 p-4">{children}</div>;
}
