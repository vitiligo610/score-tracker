"use client";

import {
  fetchInningsBatsmen,
  fetchInningsBowlers,
  fetchMatchById,
} from "@/lib/actions";
import { Match } from "@/lib/definitons";
import { createContext, useContext, useEffect, useState } from "react";

type MatchContextType = {
  matchDetails: Match | undefined;
  setMatchDetails: (matchDetails: Match) => void;
};

const MatchContext = createContext<MatchContextType | undefined>(undefined);

interface MatchProviderProps {
  match_id: number;
  children: React.ReactNode;
}

export const MatchProvider = ({ match_id, children }: MatchProviderProps) => {
  const [matchState, setMatchState] = useState<Match>();

  useEffect(() => {
    const fetchMatchDetails = async () => {
      console.log("fetching match detilas from context");
      const { match } = await fetchMatchById(match_id);
      const { batsmen } = await fetchInningsBatsmen(
        match.innings?.team_id,
        match.innings?.inning_id
      );
      const { bowlers } = await fetchInningsBowlers(
        match.team1?.team_id !== match.innings?.team_id
          ? match.team1?.team_id
          : match.team2?.team_id
      );
      setMatchState({
        ...match,
        batsmen: [...batsmen],
        striker_player_id: batsmen[0].player_id,
        bowlers: [...bowlers],
      });
      console.log("match now is ", matchState);
    };
    fetchMatchDetails();
  }, [match_id]);

  return (
    <MatchContext.Provider
      value={{ matchDetails: matchState, setMatchDetails: setMatchState }}
    >
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (!context) throw new Error("useMatch must be used within MatchProvider");
  return context;
};
