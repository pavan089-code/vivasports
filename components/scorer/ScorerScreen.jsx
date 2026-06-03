"use client";

import { useState } from "react";
import useMatch from "@/hooks/useMatch";
import BallControls from "@/components/scorer/BallControls";
import NewBatterModal from "@/components/scorer/NewBatterModel";
import NewBowlerModal from "@/components/scorer/NewBowlerModel";
import { calculateOvers } from "@/utils/matchUtils";
import { isInningsComplete } from "@/utils/inningsUtils";
import { getMatchResult } from "@/utils/resultUtils";
import { updateMatch } from "@/services/matchService";
import pointsTable from "@/Lib/pointsTable";

export default function ScorerScreen({ matchId }) {
  const { match } = useMatch(matchId);

  const [showBatterModal, setShowBatterModal] = useState(false);

  const [showBowlerModal, setShowBowlerModal] = useState(false);

  if (!match) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading Match...
      </div>
    );
  }
  async function startSecondInnings() {
    console.log("STARTING SECOND INNINGS");
    await updateMatch(matchId, {
      status: "innings_break",

      firstInningsScore: match.score + runs,
      firstInningsWickets: match.wickets,

      innings: 2,

      target: match.score + 1,

      score: 0,

      wickets: 0,

      overs: "0.0",

      totalBalls: 0,

      currentOver: [],

      balls: [],

      outPlayers: [],

      striker: null,

      nonStriker: null,

      currentBowler: null,

      battingTeam: match.bowlingTeam,

      bowlingTeam: match.battingTeam,

      battingTeamPlayers: match.bowlingTeamPlayers,

      bowlingTeamPlayers: match.battingTeamPlayers,
    });

    setShowBatterModal(true);
    setShowBowlerModal(true);

    console.log("SECOND INNINGS UPDATE SENT");
  }
  async function startSecondInningsPlay() {
    await updateMatch(matchId, {
      status: "live",
    });
  }
  console.log("STARTING SECOND INNINGS");

  async function finishMatch(result) {
    await updateMatch(matchId, {
      status: "completed",
      winner: result.winner,
      result: result.result,
      secondInningsScore: match.score,

      secondInningsWickets: match.wickets,

      completedAt: Date.now(),
    });
  }
  async function handleScore(runs) {
    if (match.status === "completed") {
      return;
    }
    if (!match.striker || !match.nonStriker || !match.currentBowler) {
      alert("Select batters and bowler first");

      return;
    }
    const updatedBalls = [...(match.currentOver || []), runs];

    const totalBalls = (match.totalBalls || 0) + 1;

    // STRIKER

    const striker = {
      ...match.striker,
    };

    striker.runs += runs;
    striker.balls += 1;

    if (runs === 4) {
      striker.fours += 1;
    }

    if (runs === 6) {
      striker.sixes += 1;
    }

    // BOWLER

    const bowler = {
      ...match.currentBowler,
    };

    bowler.runs += runs;
    bowler.balls += 1;

    // STRIKE ROTATION

    let strikerPlayer = striker;
    let nonStrikerPlayer = match.nonStriker;

    if (runs === 1 || runs === 3) {
      strikerPlayer = match.nonStriker;

      nonStrikerPlayer = striker;
    }

    // OVER COMPLETE

    const isOverComplete = totalBalls % 6 === 0;

    if (isOverComplete) {
      const temp = strikerPlayer;

      strikerPlayer = nonStrikerPlayer;

      nonStrikerPlayer = temp;
    }

    await updateMatch(matchId, {
      score: match.score + runs,

      totalBalls,

      overs: calculateOvers(totalBalls),

      currentOver: updatedBalls.slice(-6),

      striker: strikerPlayer,

      nonStriker: nonStrikerPlayer,

      currentBowler: bowler,

      balls: [
        ...(match.balls || []),
        {
          type: "run",
          runs,
          isLegalDelivery: true,
        },
      ],
    });

    // CHECK IF INNINGS ENDED

    const inningsFinished = isInningsComplete({
      ...match,
      totalBalls,
      wickets: match.wickets,
    });
    console.log("inningsFinished:", inningsFinished);
    console.log("totalBalls:", totalBalls);
    console.log("oversLimit:", match.oversLimit);
    console.log("innings:", match.innings);
    console.log("innings type:", typeof match.innings);

    if (inningsFinished && match.innings === 1) {
      await updateMatch(matchId, {
        status: "innings_break",
        firstInningsScore: match.score + runs,
        firstInningsWickets: match.wickets,

        firstInningsWickets: match.wickets,
        innings: 2,

        target: match.score + runs + 1, // handleScore

        score: 0,
        wickets: 0,

        overs: "0.0",
        totalBalls: 0,

        currentOver: [],
        balls: [],

        striker: null,
        nonStriker: null,
        currentBowler: null,

        battingTeam: match.bowlingTeam,
        bowlingTeam: match.battingTeam,

        battingTeamPlayers: match.bowlingTeamPlayers,

        bowlingTeamPlayers: match.battingTeamPlayers,
      });

      return;
    }

    // CHECK IF MATCH ENDED

    if (match.innings === 2) {
      const resultData = getMatchResult(
        match,
        match.score + runs,
        match.wickets,
      );

      if (resultData) {
        await updatePointsTable(match, resultData);

        await finishMatch(resultData);

        return;
      }
    }

    // NEW OVER

    if (isOverComplete) {
      setShowBowlerModal(true);
    }
  }

  async function handleWicket() {
    if (match.status === "completed") {
      return;
    }
    if (!match.striker || !match.nonStriker || !match.currentBowler) {
      alert("Select batters and bowler first");

      return;
    }
    const updatedBalls = [...(match.currentOver || []), "W"];

    const totalBalls = (match.totalBalls || 0) + 1;

    // OUT PLAYERS

    const outPlayers = [...(match.outPlayers || []), match.striker.name];

    // BOWLER

    const bowler = {
      ...match.currentBowler,
    };

    bowler.wickets += 1;

    bowler.balls += 1;

    // OVER COMPLETE

    const isOverComplete = totalBalls % 6 === 0;

    let strikerPlayer = match.striker;

    let nonStrikerPlayer = match.nonStriker;

    if (isOverComplete) {
      const temp = strikerPlayer;

      strikerPlayer = nonStrikerPlayer;

      nonStrikerPlayer = temp;
    }
    await updateMatch(matchId, {
      wickets: match.wickets + 1,

      totalBalls,

      overs: calculateOvers(totalBalls),

      currentOver: updatedBalls.slice(-6),

      outPlayers,

      striker: strikerPlayer,

      nonStriker: nonStrikerPlayer,

      currentBowler: bowler,

      balls: [
        ...(match.balls || []),

        {
          type: "wicket",
          runs: 0,
          isLegalDelivery: true,
        },
      ],
    });

    // CHECK IF INNINGS ENDED

    const inningsFinished = isInningsComplete({
      ...match,

      totalBalls,

      wickets: match.wickets + 1,
    });

    if (inningsFinished && match.innings === 1) {
      await updateMatch(matchId, {
        status: "innings_break",

        firstInningsScore: match.score + runs,
        firstInningsWickets: match.wickets,
        innings: 2,

        target: match.score + 1,

        score: 0,
        wickets: 0,

        overs: "0.0",
        totalBalls: 0,

        currentOver: [],
        balls: [],

        striker: null,
        nonStriker: null,
        currentBowler: null,

        battingTeam: match.bowlingTeam,
        bowlingTeam: match.battingTeam,

        battingTeamPlayers: match.bowlingTeamPlayers,

        bowlingTeamPlayers: match.battingTeamPlayers,
      });

      return;
    }

    // CHECK IF MATCH ENDED

    if (match.innings === 2) {
      const resultData = getMatchResult(match, match.score, match.wickets + 1);

      if (resultData) {
        await updatePointsTable(match, resultData);

        await finishMatch(resultData);

        return;
      }
    }

    setShowBatterModal(true);

    if (isOverComplete) {
      setShowBowlerModal(true);
    }
  }

  async function handleWide() {
    if (match.status === "completed") return;
    const updatedBalls = [...(match.currentOver || []), "WD"];

    await updateMatch(matchId, {
      score: match.score + 1,

      currentOver: updatedBalls.slice(-6),

      balls: [
        ...(match.balls || []),

        {
          type: "wide",

          runs: 1,

          isLegalDelivery: false,
        },
      ],
    });
  }

  async function handleNoBall() {
    if (match.status === "completed") return;
    const updatedBalls = [...(match.currentOver || []), "NB"];

    await updateMatch(matchId, {
      score: match.score + 1,

      currentOver: updatedBalls.slice(-6),

      balls: [
        ...(match.balls || []),

        {
          type: "no-ball",

          runs: 1,

          isLegalDelivery: false,
        },
      ],
    });
  }

  async function handleUndo() {
    const balls = [...(match.balls || [])];

    if (balls.length === 0) return;

    const lastBall = balls.pop();

    let updatedScore = match.score - lastBall.runs;

    let updatedWickets = match.wickets;

    let updatedTotalBalls = match.totalBalls || 0;

    if (lastBall.type === "wicket") {
      updatedWickets -= 1;
    }

    if (lastBall.isLegalDelivery) {
      updatedTotalBalls -= 1;
    }

    const updatedCurrentOver = balls.slice(-6).map((ball) => {
      if (ball.type === "wicket") {
        return "W";
      }

      if (ball.type === "wide") {
        return "WD";
      }

      if (ball.type === "no-ball") {
        return "NB";
      }

      return ball.runs;
    });

    await updateMatch(matchId, {
      score: updatedScore,

      wickets: updatedWickets,

      totalBalls: updatedTotalBalls,

      overs: calculateOvers(updatedTotalBalls),

      currentOver: updatedCurrentOver,

      balls,
    });
  }

  async function handleSwapStrike() {
    await updateMatch(matchId, {
      striker: match.nonStriker,

      nonStriker: match.striker,
    });
  }

  async function handleNewBatter(playerName) {
    const newBatter = {
      name: playerName,

      runs: 0,

      balls: 0,

      fours: 0,

      sixes: 0,
    };

    // First opener
    if (!match.striker) {
      await updateMatch(matchId, {
        striker: newBatter,
      });

      return;
    }

    // Second opener
    if (!match.nonStriker) {
      await updateMatch(matchId, {
        nonStriker: newBatter,
      });

      setShowBatterModal(false);

      return;
    }

    // Wicket replacement
    await updateMatch(matchId, {
      striker: newBatter,
    });

    setShowBatterModal(false);
  }

  async function handleNewBowler(playerName) {
    const newBowler = {
      name: playerName,

      runs: 0,

      wickets: 0,

      balls: 0,
    };

    await updateMatch(matchId, {
      currentBowler: newBowler,
    });

    setShowBowlerModal(false);
  }
  if (match.status === "completed") {
    return (
      <main className="min-h-screen bg-[#050B18] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-black">MATCH COMPLETED</h1>

          <p className="mt-6 text-3xl">{match.result?.result}</p>

          <p className="mt-4 text-slate-400">Winner: {match.result?.winner}</p>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-[#050B18] text-white p-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <div>
          <p className="text-cyan-400 text-sm">SCORER PANEL</p>

          <h1 className="text-5xl font-black mt-2">
            {match.teamA} vs {match.teamB}
          </h1>
        </div>

        <div className="bg-[#101D35] rounded-3xl p-10">
          <div className="flex items-end gap-4">
            <h2 className="text-8xl font-black">
              {match.score}/{match.wickets}
            </h2>

            <p className="text-3xl text-slate-400 mb-3">({match.overs})</p>
          </div>
        </div>

        {match.status === "innings_break" ? (
          <div className="bg-[#101D35] rounded-3xl p-10 text-center">
            <h2 className="text-4xl font-black">SECOND INNINGS SETUP</h2>

            <p className="text-slate-400 mt-4">
              Select striker, non-striker and bowler before starting the
              innings.
            </p>

            <div className="flex justify-center gap-4 mt-8">
              <button onClick={() => setShowBatterModal(true)}>
                {!match.striker
                  ? "Select Striker"
                  : !match.nonStriker
                    ? "Select Non-Striker"
                    : "Change Batter"}
              </button>

              <button
                onClick={() => setShowBowlerModal(true)}
                className="
            bg-purple-600
            px-6
            py-3
            rounded-xl
          "
              >
                Select Bowler
              </button>
            </div>

            <button
              disabled={
                !match.striker || !match.nonStriker || !match.currentBowler
              }
              onClick={startSecondInningsPlay}
              className="
    mt-8
    bg-green-600
    px-8
    py-4
    rounded-xl
    text-xl
    font-bold
    disabled:opacity-50
  "
            >
              START SECOND INNINGS
            </button>
          </div>
        ) : (
          <BallControls
            onScore={handleScore}
            onWicket={handleWicket}
            onWide={handleWide}
            onNoBall={handleNoBall}
            onUndo={handleUndo}
            onSwapStrike={handleSwapStrike}
          />
        )}
      </div>

      <NewBatterModal
        open={showBatterModal}
        players={match.battingTeamPlayers || []}
        currentStriker={match.striker?.name}
        currentNonStriker={match.nonStriker?.name}
        outPlayers={match.outPlayers || []}
        onSelect={handleNewBatter}
      />

      <NewBowlerModal
        open={showBowlerModal}
        players={match.bowlingTeamPlayers || []}
        currentBowler={match.currentBowler?.name}
        onSelect={handleNewBowler}
      />
    </main>
  );
}
