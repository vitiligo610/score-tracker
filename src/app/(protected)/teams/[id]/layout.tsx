import BackLink from "@/components/ui/back-link";

const TeamLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <BackLink href="/teams" label="All Teams" />
      {children}
    </div>
  )
}

export default TeamLayout;