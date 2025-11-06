import { OptionCard } from "@/components/home/option-card";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { GenerateDataButton } from "@/components/home/generate-data"
import { isDataGeneratedForUser } from "@/lib/actions";

export default async function Home() {
  const { user } = await withAuth({ ensureSignedIn: true });
  const isDataGenerated = await isDataGeneratedForUser(user.id);

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";

  return (
    <div className="max-w-5xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl text-primary">
          Welcome {fullName}!
        </h1>
        <h2 className="text-xl font-semibold tracking-tighter sm:text-2xl md:text-3xl lg:text-4xl text-secondary">
          Get Started...
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        <div className="flex flex-col">
          <OptionCard
            title="Tournaments"
            href="/tournaments"
            description="Organize multi-team tournaments for club championships and local leagues."
          />
        </div>
        <div className="flex flex-col">
          <OptionCard
            title="Series"
            href="/series"
            description="Create bilateral or tri-series between teams. Ideal for international matches and practice series."
          />
        </div>
        <div className="flex flex-col">
          <OptionCard
            title="Teams"
            href="/teams"
            description="Manage your teams, add new players, and organize your squad."
          />
        </div>
        <div className="flex flex-col">
          <OptionCard
            title="Players"
            href="/players"
            description="View player statistics, manage player profiles, and track performance."
          />
        </div>
      </div>

      {!isDataGenerated && <div className="px-4">
        <GenerateDataButton userId={user.id}/>
      </div>}
    </div>
  );
}