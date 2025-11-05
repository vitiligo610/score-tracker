import { withAuth } from "@workos-inc/authkit-nextjs";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await withAuth({ ensureSignedIn: true })

  return children
}
