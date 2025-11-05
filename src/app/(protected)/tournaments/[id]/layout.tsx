import BackLink from "@/components/ui/back-link";

const TournamentLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <BackLink href="/tournaments" label="All Tournaments" />
      {children}
    </div>
  );
}

export default TournamentLayout;