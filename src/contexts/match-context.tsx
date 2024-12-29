"use client";

import {
  fetchMatchById,
  insertBallForInning,
} from "@/lib/actions";
import {
  Ball,
  CurrentBall,
  OngoingMatch,
  MatchResponse,
  InningsResponse,
  BattingTeamPlayer,
  BowlingTeamPlayer,
} from "@/lib/definitons";
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
    BattingTeamPlayer[]
  >([]);
  const [bowlingTeamPlayers, setBowlingTeamPlayers] = useState<
    BowlingTeamPlayer[]
  >([]);
  const { toast } = useToast();

  const fetchMatchDetails = async () => {
    setLoading(true);
    console.log("Fetching match details from context");

    const matchResponse: MatchResponse = await fetchMatchById(match_id);

    const {
      match,
      battingTeamPlayers: battingTeam,
      bowlingTeamPlayers: bowlingTeam,
    } = matchResponse;

    const bowlers = bowlingTeam
      .filter((bowler) => bowler.bowling_order)
      .sort((a, b) => (a.bowling_order || 0) - (a.bowling_order || 0));
    const batsmen = battingTeam
      .filter((batsman) => !batsman.dismissal_id)
      .sort((a, b) => (a.batting_order || 0) - (b.batting_order || 0))
      .slice(0, 2);

    const inningsResponse: InningsResponse = {
      batsmen,
      bowlers,
    };

    processAndSetMatchState(matchResponse, inningsResponse);

    setLoading(false);
  };

  const processAndSetMatchState = (
    {
      match,
      battingTeamPlayers: battingTeam,
      bowlingTeamPlayers: bowlingTeam,
    }: MatchResponse,
    { batsmen, bowlers }: InningsResponse
  ) => {
    // Determine current bowler and next bowler
    const currentBowler = bowlers.find(
      (b) => b.player_id === match.over.bowler_id
    )!;
    const nextBowlerId =
      bowlers.find((b) => b.bowling_order > currentBowler?.bowling_order)
        ?.player_id || bowlers[0].player_id;

    // Determine last ball, striker, and batsman updates
    const lastBall = match.over.balls.at(-1);
    const isNewOver = lastBall?.ball_number === 6;

    let updatedBatsmen = [...batsmen];
    let newStrikerId = batsmen[0].player_id;

    if (lastBall?.is_wicket && lastBall.dismissal?.dismissed_batsman_id) {
      const dismissedId = lastBall.dismissal.dismissed_batsman_id;
      const nextBatsman = battingTeam.find(
        (p) =>
          p.batting_order! > Math.max(...batsmen.map((b) => b.batting_order))
      );

      if (nextBatsman) {
        updatedBatsmen = batsmen.map((b) =>
          b.player_id === dismissedId
            ? {
                player_id: nextBatsman.player_id,
                name: `${nextBatsman.first_name} ${nextBatsman.last_name}`,
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

      const wasStrikerDismissed = lastBall.batsman_id === dismissedId;
      newStrikerId = wasStrikerDismissed
        ? nextBatsman?.player_id ||
          batsmen.find((b) => b.player_id !== dismissedId)!.player_id
        : lastBall.batsman_id;
    } else if (lastBall) {
      const nonStriker = batsmen.find(
        (b) => b.player_id !== lastBall.batsman_id
      )!.player_id;
      newStrikerId = isNewOver
        ? nonStriker
        : lastBall.runs_scored % 2 === 1
        ? nonStriker
        : lastBall.batsman_id;
    }

    // Update match state
    setMatchState((prevState) => ({
      ...prevState,
      ...match,
      batsmen: updatedBatsmen,
      striker_player_id: newStrikerId,
      bowlers,
      innings: {
        ...match.innings,
        total_overs: match.innings.total_overs + (isNewOver ? 1 : 0),
      },
      over: {
        ...match.over,
        bowler_id: isNewOver ? nextBowlerId : match.over.bowler_id,
        over_number: match.over.over_number + (isNewOver ? 1 : 0),
        balls: isNewOver ? [] : match.over.balls,
        total_runs: isNewOver ? 0 : match.over.total_runs,
        total_wickets: isNewOver ? 0 : match.over.total_wickets,
      },
    }));

    // Update teams separately
    setBattingTeamPlayers(battingTeam);
    setBowlingTeamPlayers(bowlingTeam);
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

          const updatedBowler = {
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

          // Update match bowlers array
          const matchBowlerIndex = matchState.bowlers.findIndex(
            (b) => b.player_id === bowler.player_id
          );
          if (matchBowlerIndex !== -1) {
            matchState.bowlers[matchBowlerIndex] = {
              ...matchState.bowlers[matchBowlerIndex],
              ...updatedBowler,
            };
          }

          return updatedBowler;
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
            const updatedStats = {
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

            // Update battingTeamPlayers state
            setBattingTeamPlayers((prev) =>
              prev.map((player) =>
                player.player_id === batsman.player_id
                  ? {
                      ...player,
                      runs_scored: updatedStats.runs_scored,
                      balls_faced: updatedStats.balls_faced,
                      fours: updatedStats.fours,
                      sixes: updatedStats.sixes,
                      strike_rate: updatedStats.strike_rate,
                      dismissal_id: ball.is_wicket && ball.dismissal.dismissed_batsman_id === player.player_id
                        ? player.player_id
                        : null,
                    }
                  : player
              )
            );

            return updatedStats;
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
