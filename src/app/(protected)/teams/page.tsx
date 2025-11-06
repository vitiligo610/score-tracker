import TeamFormDialog from "@/components/teams/team-form-dialog";
import TeamsInfo from "@/components/teams/teams-info";
import BackLink from "@/components/ui/back-link";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui/search-input";
import TeamsSkeleton from "@/components/ui/skeletons/teams-skeleton";
import { PlusIcon } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";

import {getWorkOsUser} from "@/lib/auth";

export const metadata: Metadata = {
  title: "Teams",
};

const Teams = async ({
  searchParams
}: {
  searchParams?: Promise<{
    query?: string;
    page?: number;
  }>
}) => {
  const params = await searchParams;
  const searchQuery = params?.query || "";
  const currentPage = Number(params?.page) || 1;

  const { id: userId } = await getWorkOsUser();

  return (
    <div className="container mx-auto pb-8 space-y-8">
      <BackLink href="/home" label="Home" />
      <div className="w-full flex justify-between items-center mb-12">
        <h1 className="text-7xl text-primary font-bold">Teams</h1>
        <TeamFormDialog userId={userId}>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" /> Add Team
          </Button>
        </TeamFormDialog>
      </div>
      <div className="flex gap-2">
        <SearchInput placeholder="Search teams..." />
      </div>
      <Suspense fallback={<TeamsSkeleton />}>
        <TeamsInfo
          userId={userId}
          query={searchQuery}
          page={currentPage}
        />
      </Suspense>
    </div>
  );
}

export default Teams;