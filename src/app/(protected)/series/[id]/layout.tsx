import BackLink from "@/components/ui/back-link";

const SeriesLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <BackLink href="/series" label="All Series" />
      {children}
    </div>
  );
}

export default SeriesLayout;