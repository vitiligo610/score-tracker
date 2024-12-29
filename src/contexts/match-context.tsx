"use client";

import {
  fetchInningsBatsmen,
  fetchInningsBatsmenAndBowlers,
  fetchInningsBowlers,
  fetchMatchById,
  fetchTeamPlayers,
  insertBallForInning,
} from "@/lib/actions";
import { Ball, CurrentBall, OngoingMatch } from "@/lib/definitons";
import { createContext, useContext, useEffect, useState } from "react";
import { PlayerWithTeam } from "@/lib/definitons";
import { useToast } from "@/hooks/use-toast";
import { getEconomyRate, getStrikeRate, updateBowlerOvers } from "@/lib/utils";

type MatchContextType = {
  loading: boolean;
  submitting: boolean;
  matchDetails: OngoingMatch | undefined;
  setMatchDetails: (matchDetails: OngoingMatch) => void;
  battingTeamPlayers: PlayerWithTeam[];
  bowlingTeamPlayers: PlayerWithTeam[];
  submitBall: (ball: CurrentBall) => void;
};

const MatchContext = createContext<MatchContextType | undefined>(undefined);

interface MatchProviderProps {
  match_id: number;
  children: React.ReactNode;
}

export const MatchProvider = ({ match_id, children }: MatchProviderProps) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [matchState, setMatchState] = useState<OngoingMatch>();
  const [battingTeamPlayers, setBattingTeamPlayers] = useState<
    PlayerWithTeam[]
  >([]);
  const [bowlingTeamPlayers, setBowlingTeamPlayers] = useState<
    PlayerWithTeam[]
  >([]);
  const { toast } = useToast();

  const fetchMatchDetails = async () => {
    setLoading(true);
    console.log("fetching match detilas from context");
    const {
      match,
      battingTeamPlayers: battingTeam,
      bowlingTeamPlayers: bowlingTeam,
    } = await fetchMatchById(match_id);

    const battingTeamId = match.innings.team_id;
    const inningsId = match.innings.inning_id;
    const bowlingTeamId =
      match.team1.team_id !== match.innings.team_id
        ? match.team1.team_id
        : match.team2.team_id;
    const { batsmen, bowlers } = await fetchInningsBatsmenAndBowlers(
      battingTeamId,
      inningsId,
      bowlingTeamId
    );

    setBattingTeamPlayers(battingTeam);
    setBowlingTeamPlayers(bowlingTeam);

    const currentBowler = bowlers.find(
      (bowler) => bowler.player_id === match.over.bowler_id
    )!;
    const nextBowlerId =
      bowlers.find(
        (bowler) => bowler.bowling_order > currentBowler!.bowling_order
      )?.player_id || bowlers[0].player_id;

    // Get last ball details
    const lastBall = match.over.balls[match.over.balls.length - 1];
    const isNewOver = lastBall?.ball_number === 6;

    // Handle dismissal from last ball
    let updatedBatsmen = [...batsmen];
    let newStrikerId = batsmen[0].player_id;

    if (lastBall?.is_wicket && lastBall.dismissal?.dismissed_batsman_id) {
      const dismissedId = lastBall.dismissal.dismissed_batsman_id;
      const maxBattingOrder = Math.max(...batsmen.map((b) => b.batting_order));
      const nextBatsman = battingTeam.find(
        (p) => p.batting_order! > maxBattingOrder
      );

      if (nextBatsman) {
        updatedBatsmen = batsmen.map((b) =>
          b.player_id === dismissedId
            ? {
                player_id: nextBatsman.player_id,
                name: nextBatsman.first_name + " " + nextBatsman.last_name,
                batting_order: nextBatsman.batting_order!,
                batting_style: nextBatsman.batting_style,
                runs_scored: 0,
                balls_faced: 0,
                fours: 0,
                sixes: 0,
                strike_rate: 0,
              }
            : b
        );
      }

      // Determine striker after wicket
      const wasStrikerDismissed = lastBall.batsman_id === dismissedId;
      if (wasStrikerDismissed) {
        newStrikerId =
          nextBatsman?.player_id ||
          batsmen.find((b) => b.player_id !== dismissedId)?.player_id!;
      } else {
        newStrikerId = lastBall.batsman_id;
      }
    } else if (lastBall) {
      // No wicket - determine striker based on runs and over
      const lastBallStriker = lastBall.batsman_id;
      const nonStriker = batsmen.find(
        (b) => b.player_id !== lastBall.batsman_id
      )?.player_id!;

      if (isNewOver) {
        newStrikerId = nonStriker;
      } else if (lastBall.runs_scored % 2 === 1) {
        newStrikerId = nonStriker;
      } else {
        newStrikerId = lastBallStriker;
      }
    }

    setMatchState({
      ...match,
      batsmen: [...batsmen],
      striker_player_id: newStrikerId,
      bowlers: [...bowlers],
      innings: {
        ...match.innings,
        total_overs: match.innings.total_overs + (isNewOver ? 1 : 0),
      },
      over: {
        ...match.over,
        bowler_id: !isNewOver ? match.over.bowler_id : nextBowlerId,
        over_number: match.over.over_number + (isNewOver ? 1 : 0),
        balls: !isNewOver ? match.over.balls : [],
        total_runs: !isNewOver ? match.over.total_runs : 0,
        total_wickets: !isNewOver ? match.over.total_wickets : 0,
      },
    });

    setLoading(false);
  };

  const submitBall = async (ball: CurrentBall) => {
    try {
      setSubmitting(true);

      // console.log("match status check ", matchState);
      if (!matchState) return;

      const currentOver = matchState.over;
      const balls = currentOver.balls;
      const lastBall = balls.length > 0 ? balls[balls.length - 1] : null;

      const batsmen = matchState.batsmen;

      // Prepare ball data
      const ballData: Ball = {
        inning_id: matchState.innings.inning_id,
        over_number: currentOver.over_number,
        ball_number:
          ball.extra.type === null
            ? lastBall
              ? lastBall.ball_number + 1
              : 1
            : lastBall
            ? lastBall.ball_number
            : 0,
        batsman_id: matchState.striker_player_id,
        non_striker_id:
          batsmen.find(
            (batsman) => batsman.player_id !== matchState.striker_player_id
          )?.player_id || 0,
        bowler_id: currentOver.bowler_id,
        runs_scored: ball.runs_scored,
        is_legal: ball.is_legal,
        is_wicket: ball.is_wicket,
        extra:
          ball.extra.type !== null
            ? {
                type: ball.extra.type,
                runs: ball.extra.runs,
              }
            : undefined,
        dismissal:
          ball.dismissal.type !== null ? { ...ball.dismissal } : undefined,
      };

      // Submit to server
      await insertBallForInning(ballData);

      // Update local state
      setMatchState((prev) => {
        if (!prev) return prev;

        const newOver = ballData.ball_number === 6;
        const currentBowler = prev.bowlers.find(
          (bowler) => bowler.player_id === prev.over.bowler_id
        );
        const nextBowlerId =
          prev.bowlers.find(
            (bowler) => bowler.bowling_order > currentBowler!.bowling_order
          )?.player_id || prev.bowlers[0].player_id;
        const totalRuns = ballData.runs_scored + (ballData?.extra?.runs || 0);

        // update bowlers
        const updatedBowlers = prev.bowlers.map((bowler) => {
          const isCurrentBowler = bowler.player_id === currentBowler!.player_id;

          if (!isCurrentBowler) return bowler;

          return {
            ...bowler,
            runs_conceded: bowler.runs_conceded + totalRuns,
            wickets_taken: bowler.wickets_taken + (ballData.is_wicket ? 1 : 0),
            overs_bowled: updateBowlerOvers(
              bowler.overs_bowled,
              ballData.is_legal
            ),
            economy_rate: getEconomyRate(
              bowler.runs_conceded + totalRuns,
              bowler.overs_bowled
            ),
          };
        });

        // Update batsmen
        const currentBatsmen = prev.batsmen;
        const maxBattingOrder = Math.max(
          ...currentBatsmen.map((b) => b.batting_order)
        );
        const nonStriker = currentBatsmen.find(
          (b) => b.player_id !== prev.striker_player_id
        )!;
        const nextBatsman = battingTeamPlayers.find(
          (player) => player.batting_order! > maxBattingOrder
        );

        let updatedBatsmen = currentBatsmen.map((batsman) => {
          if (batsman.player_id === prev.striker_player_id) {
            return {
              ...batsman,
              runs_scored: batsman.runs_scored + ballData.runs_scored,
              balls_faced: batsman.balls_faced + (ballData.is_legal ? 1 : 0),
              fours: batsman.fours + (ballData.runs_scored === 4 ? 1 : 0),
              sixes: batsman.sixes + (ballData.runs_scored === 6 ? 1 : 0),
              strike_rate: getStrikeRate(
                batsman.runs_scored + ballData.runs_scored,
                batsman.balls_faced + (ballData.is_legal ? 1 : 0)
              ),
            };
          }
          return batsman;
        });

        // Handle dismissal
        if (ballData.is_wicket && ballData.dismissal?.dismissed_batsman_id) {
          if (nextBatsman) {
            updatedBatsmen = updatedBatsmen.map((batsman) =>
              batsman.player_id === ballData.dismissal?.dismissed_batsman_id
                ? {
                    player_id: nextBatsman.player_id,
                    name: nextBatsman.first_name + " " + nextBatsman.last_name,
                    batting_style: nextBatsman.batting_style,
                    batting_order: nextBatsman.batting_order!,
                    runs_scored: 0,
                    balls_faced: 0,
                    fours: 0,
                    sixes: 0,
                    strike_rate: 0,
                  }
                : batsman
            );
          }
        }

        // Update striker player
        let newStrikerId = prev.striker_player_id;

        // If striker is dismissed, new batsman becomes striker
        if (
          ballData.dismissal &&
          ballData.dismissal.dismissed_batsman_id === prev.striker_player_id
        ) {
          newStrikerId = nextBatsman?.player_id!;
        }
        // If non-striker is dismissed, keep current striker
        else if (
          ballData.dismissal &&
          ballData.dismissal.dismissed_batsman_id === nonStriker.player_id
        ) {
          newStrikerId = prev.striker_player_id;
        }
        // Rotate strike for odd runs on legal deliveries
        else if (ballData.is_legal && ballData.runs_scored % 2 === 1) {
          newStrikerId = nonStriker.player_id;
        }
        // Rotate strike at end of over if legal delivery
        else if (ballData.is_legal && ballData.ball_number === 6) {
          newStrikerId = nonStriker.player_id;
        }

        // Update extras
        const updatedExtras = {
          ...prev.innings.extras,
          nb_count:
            prev.innings.extras.nb_count +
            (ball.extra.type === "No Ball" ? 1 : 0),
          wd_count:
            prev.innings.extras.wd_count + (ball.extra.type === "Wide" ? 1 : 0),
          b_count:
            prev.innings.extras.b_count + (ball.extra.type === "Bye" ? 1 : 0),
          lb_count:
            prev.innings.extras.lb_count +
            (ball.extra.type === "Leg Bye" ? 1 : 0),
          p_count:
            prev.innings.extras.p_count +
            (ball.extra.type === "Penalty" ? 1 : 0),
          total_count:
            prev.innings.extras.total_count + (ball.extra.type ? 1 : 0),
        };

        return {
          ...prev,
          innings: {
            ...prev.innings,
            total_overs: prev.innings.total_overs + (newOver ? 1 : 0),
            total_runs: prev.innings.total_runs + totalRuns,
            total_wickets:
              prev.innings.total_wickets + (ballData.is_wicket ? 1 : 0),
            extras: {
              ...updatedExtras,
            },
          },
          over: {
            ...prev.over,
            bowler_id: !newOver ? prev.over.bowler_id : nextBowlerId,
            over_number: prev.over.over_number + (newOver ? 1 : 0),
            balls: !newOver ? [...(prev.over.balls || []), ballData] : [],
            total_runs: !newOver ? prev.over.total_runs + totalRuns : 0,
            total_wickets: !newOver
              ? prev.over.total_wickets + (ballData.is_wicket ? 1 : 0)
              : 0,
          },
          bowlers: [...updatedBowlers],
          batsmen: [...updatedBatsmen],
          striker_player_id: newStrikerId,
        };
      });

      // toast({
      //   title: "Success",
      //   description: "Ball recorded successfully",
      // });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit ball data",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchMatchDetails();
  }, [match_id]);

  return (
    <MatchContext.Provider
      value={{
        loading,
        submitting,
        matchDetails: matchState,
        setMatchDetails: setMatchState,
        battingTeamPlayers,
        bowlingTeamPlayers,
        submitBall,
      }}
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
