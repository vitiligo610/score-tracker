import { Navbar } from "@/components/layout/navbar";
import { OptionCard } from "@/components/home/option-card";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
              Get Started...
            </h1>
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

        </div>
      </main>
    </div>
  );
}