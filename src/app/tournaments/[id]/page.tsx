import { fetchTournamentById } from "@/lib/actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Tournament",
};

const TournamentPage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const p = await params;
  const tournament_id = Number(p.id);
  const { tournament } = await fetchTournamentById(tournament_id);

  return (
    <div>{tournament.name}</div>
  )
}

export default TournamentPage;