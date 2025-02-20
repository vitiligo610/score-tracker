import CreateTournamentDialog from "@/components/tournaments/create-tournament-dialog";
import CompetitionFilters from "@/components/layout/competition-filters";
import { Metadata } from "next";
import AllTournaments from "@/components/tournaments/all-tournaments";
import { Suspense } from "react";
import AllTournamentsSkeleton from "@/components/ui/skeletons/all-tournaments-skeleton";
import BackLink from "@/components/ui/back-link";

export const metadata: Metadata = {
  title: "Tournaments",
};

const Tournaments = async ({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) => {
  const params = await searchParams;

  return (
    <div className="container mx-auto pb-8 space-y-8">
      <BackLink href="/" label="Home" />
      <div className="w-full flex flex-col gap-4 md:flex-row justify-between items-start md:items-center">
        <h1 className="text-4xl lg:text-7xl text-primary font-bold">
          Tournaments
        </h1>
        <CreateTournamentDialog />
      </div>
      <CompetitionFilters />

      <Suspense fallback={<AllTournamentsSkeleton />}>
        <AllTournaments filter={params.filter} />
      </Suspense>
    </div>
  );
};

export default Tournaments;
