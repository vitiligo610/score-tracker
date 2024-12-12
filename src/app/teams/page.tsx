import TeamsInfo from "@/components/teams/teams-info";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui/search-input";
import TeamsSkeleton from "@/components/ui/skeletons/teams-skeleton";
import { PlusIcon } from "lucide-react";
import { Suspense } from "react";

const Teams = async ({
  searchParams
}: {
  searchParams?: {
    query?: string;
    page?: number;
  }
}) => {
  const params = await searchParams;
  const searchQuery = params?.query || "";
  const currentPage = Number(params?.page) || 1;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="w-full flex justify-between items-center mb-12">
        <h1 className="text-7xl text-primary font-bold">Teams</h1>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Team
        </Button>
      </div>
      <div className="flex gap-2">
        <SearchInput placeholder="Search teams..." />
      </div>
      <Suspense fallback={<TeamsSkeleton />}>
        <TeamsInfo
          query={searchQuery}
          page={currentPage}
        />
      </Suspense>
    </div>
  );
}

export default Teams;