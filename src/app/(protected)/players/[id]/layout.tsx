import BackLink from "@/components/ui/back-link";

const PlayerLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <BackLink href="/players" label="All Players" />
      {children}
    </div>
  );
}

export default PlayerLayout;