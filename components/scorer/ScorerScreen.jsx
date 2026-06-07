"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import useMatch from "@/hooks/useMatch";
import BallControls from "@/components/scorer/BallControls";
import CurrentOver from "@/components/scorer/CurrentOver";
import BatterCard from "@/components/match/BatterCard";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { calculateOvers } from "@/utils/matchUtils";
import { isInningsComplete } from "@/utils/inningsUtils";
import { getMatchResult } from "@/utils/resultUtils";
import { updateMatch } from "@/services/matchService";

const NewBatterModal = dynamic(() => import("@/components/scorer/NewBatterModel"), {
  loading: () => null,
});
const NewBowlerModal = dynamic(() => import("@/components/scorer/NewBowlerModel"), {
  loading: () => null,
});
const DismissalModal = dynamic(() => import("@/components/scorer/DismissalModal"), {
  loading: () => null,
});
const PauseReasonModal = dynamic(() => import("@/components/scorer/PauseReasonModal"), {
  loading: () => null,
});
const MatchNotesPanel = dynamic(() => import("@/components/scorer/MatchNotesPanel"), {
  loading: () => null,
});

function clonePlayer(player) {
  return player ? { ...player } : null;
}

const HISTORY_LIMIT = 12;

function withoutUndefined(value) {
  if (Array.isArray(value)) {
    return value.map(withoutUndefined);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([key, entryValue]) => [key, withoutUndefined(entryValue)])
    );
  }

  return value;
}

function compactHistory(stack = []) {
  return stack
    .slice(-HISTORY_LIMIT)
    .map((snapshot) => {
      const rest = { ...snapshot };
      delete rest.balls;
      delete rest.commentary;

      return {
        ...rest,
        ballsTail: (snapshot.ballsTail || []).map(compactBallRecord),
        commentaryTail: (snapshot.commentaryTail || []).map(compactBallRecord),
      };
    });
}

function compactBallRecord(ball) {
  if (!ball) return ball;

  return withoutUndefined({
    ...ball,
    before: ball.before ? createSnapshot(ball.before) : null,
  });
}

function compactEvents(events = []) {
  return events.map(compactBallRecord);
}

function needsCompaction(match) {
  const historyHasFullArrays = [...(match.undoStack || []), ...(match.redoStack || [])]
    .some((snapshot) => snapshot.balls || snapshot.commentary);
  const ballsHaveFullBefore = (match.balls || [])
    .some((ball) => ball.before?.balls || ball.before?.commentary);

  return historyHasFullArrays || ballsHaveFullBefore;
}

function getWritableEvents(match, key) {
  const events = match[key] || [];

  return needsCompaction(match) ? compactEvents(events) : events;
}

function createSnapshot(match) {
  return withoutUndefined({
    score: match.score || 0,
    wickets: match.wickets || 0,
    totalBalls: match.totalBalls || 0,
    overs: match.overs || "0.0",
    currentOver: [...(match.currentOver || [])],
    striker: clonePlayer(match.striker),
    nonStriker: clonePlayer(match.nonStriker),
    currentBowler: clonePlayer(match.currentBowler),
    outPlayers: [...(match.outPlayers || [])],
    status: match.status,
    innings: match.innings,
    oversLimit: match.oversLimit,
    oversPerInnings: match.oversPerInnings,
    inningsOvers: match.inningsOvers,
    matchOvers: match.matchOvers,
    maxOvers: match.maxOvers,
    target: match.target ?? null,
    battingTeam: match.battingTeam,
    bowlingTeam: match.bowlingTeam,
    battingTeamPlayers: [...(match.battingTeamPlayers || [])],
    bowlingTeamPlayers: [...(match.bowlingTeamPlayers || [])],
    firstInningsScore: match.firstInningsScore ?? null,
    firstInningsWickets: match.firstInningsWickets ?? null,
    secondInningsScore: match.secondInningsScore ?? null,
    secondInningsWickets: match.secondInningsWickets ?? null,
    winner: match.winner ?? null,
    result: match.result ?? null,
    completedAt: match.completedAt ?? null,
    playerOfMatch: match.playerOfMatch ?? null,
    ballsLength: (match.balls || []).length,
    commentaryLength: (match.commentary || []).length,
    bowlerChangeBefore: match.bowlerChangeBefore ?? null,
    retiredHurtPlayers: [...(match.retiredHurtPlayers || [])],
    matchNotes: [...(match.matchNotes || [])],
    pauseReason: match.pauseReason ?? null,
    pausedAt: match.pausedAt ?? null,
    resumedAt: match.resumedAt ?? null,
    revisedOvers: match.revisedOvers ?? null,
    revisedTarget: match.revisedTarget ?? null,
    revisionReason: match.revisionReason ?? null,
    revisedTargetApplied: match.revisedTargetApplied ?? false,
    resultType: match.resultType ?? null,
    abandonedReason: match.abandonedReason ?? null,
    abandonedPoints: match.abandonedPoints ?? null,
    walkoverWinner: match.walkoverWinner ?? null,
    walkoverLoser: match.walkoverLoser ?? null,
  });
}

function getUndoStack(match) {
  return compactHistory(match.undoStack || []);
}

function getRedoStack(match) {
  return compactHistory(match.redoStack || []);
}

function pushHistory(stack, snapshot) {
  return compactHistory([...stack, snapshot]);
}

function createRedoSnapshot(currentMatch, restoreSnapshot) {
  const current = createSnapshot(currentMatch);
  const restoreBallsLength = restoreSnapshot?.ballsLength ?? (currentMatch.balls || []).length;
  const restoreCommentaryLength =
    restoreSnapshot?.commentaryLength ?? (currentMatch.commentary || []).length;

  return {
    ...current,
    ballsTail: compactEvents((currentMatch.balls || []).slice(restoreBallsLength)),
    commentaryTail: compactEvents(
      (currentMatch.commentary || []).slice(restoreCommentaryLength)
    ),
  };
}

function restoreSnapshot(snapshot, currentMatch) {
  const {
    ballsLength,
    commentaryLength,
    ballsTail = [],
    commentaryTail = [],
    ...rest
  } = snapshot;
  const restoreBallsLength = ballsLength ?? (currentMatch.balls || []).length;
  const restoreCommentaryLength =
    commentaryLength ?? (currentMatch.commentary || []).length;
  const ballsBase = compactEvents((currentMatch.balls || []).slice(0, restoreBallsLength));
  const commentaryBase = compactEvents(
    (currentMatch.commentary || []).slice(0, restoreCommentaryLength)
  );

  return {
    ...rest,
    balls: [...ballsBase, ...ballsTail],
    commentary: [...commentaryBase, ...commentaryTail],
  };
}

function getNextBallLabel(totalBalls) {
  const overs = Math.floor(totalBalls / 6);
  const ball = (totalBalls % 6) + 1;
  return `${overs}.${ball}`;
}

function getResultText(result) {
  if (!result) return "";
  if (typeof result === "string") return result;
  return result.result || "";
}

function getBowlerOvers(bowler) {
  return calculateOvers(bowler?.balls || 0);
}

export default function ScorerScreen({ matchId }) {
  const { match, loading } = useMatch(matchId);

  const [showBatterModal, setShowBatterModal] = useState(false);
  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [showDismissalModal, setShowDismissalModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionToast, setActionToast] = useState("");
  const [tossWinnerInput, setTossWinnerInput] = useState("");
  const [tossDecisionInput, setTossDecisionInput] = useState("");
  const toastTimer = useRef(null);

  const scorerState = useMemo(() => {
    const currentMatch = match || {};

    return {
      needsToss: !!match && (!match.tossWinner || !match.tossDecision),
      needsBatter: !!match && (!match.striker || !match.nonStriker),
      needsBowler: !!match && !match.currentBowler,
      undoStack: getUndoStack(currentMatch),
      redoStack: getRedoStack(currentMatch),
      resultText: getResultText(currentMatch.result),
      bowlerOvers: getBowlerOvers(currentMatch.currentBowler),
      latestNotes: currentMatch.matchNotes || [],
    };
  }, [match]);

  const {
    needsToss,
    needsBatter,
    needsBowler,
    undoStack,
    redoStack,
    resultText,
    bowlerOvers,
    latestNotes,
  } = scorerState;

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  if (loading) {
    return <LoadingSkeleton title="SCORER" />;
  }

  if (!match) {
    return (
      <main className="vs-page px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <EmptyState
            title="Match not found"
            message="This scorer link is unavailable or the match has been removed."
            actionHref="/admin"
            actionLabel="Back to Admin"
          />
        </div>
      </main>
    );
  }

  function showActionToast(message) {
    setActionToast(message);

    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    toastTimer.current = setTimeout(() => {
      setActionToast("");
    }, 1500);
  }

  function withUndoHistory(update, before = createSnapshot(match)) {
    return {
      balls: getWritableEvents(match, "balls"),
      commentary: getWritableEvents(match, "commentary"),
      ...update,
      undoStack: pushHistory(getUndoStack(match), before),
      redoStack: [],
    };
  }

  async function startSecondInningsPlay() {
    if (!match.striker || !match.nonStriker || !match.currentBowler) {
      alert("Select striker, non-striker and bowler first");
      return;
    }

    await updateMatch(matchId, {
      ...withUndoHistory({
        status: "live",
      }),
    });
    showActionToast("Resume");
  }

  async function handleConductToss() {
    if (!tossWinnerInput || !tossDecisionInput) {
      alert("Select toss winner and decision");
      return;
    }

    const otherTeam = tossWinnerInput === match.teamA ? match.teamB : match.teamA;
    const battingTeam =
      tossDecisionInput === "bat" ? tossWinnerInput : otherTeam;
    const bowlingTeam =
      tossDecisionInput === "bat" ? otherTeam : tossWinnerInput;
    const teamAPlayers = match.teamAPlayers || (
      match.battingTeam === match.teamA
        ? match.battingTeamPlayers
        : match.bowlingTeamPlayers
    ) || [];
    const teamBPlayers = match.teamBPlayers || (
      match.battingTeam === match.teamB
        ? match.battingTeamPlayers
        : match.bowlingTeamPlayers
    ) || [];

    await updateMatch(matchId, withUndoHistory({
      tossWinner: tossWinnerInput,
      tossDecision: tossDecisionInput,
      battingTeam,
      bowlingTeam,
      battingTeamPlayers: battingTeam === match.teamA ? teamAPlayers : teamBPlayers,
      bowlingTeamPlayers: bowlingTeam === match.teamA ? teamAPlayers : teamBPlayers,
      status: "live",
    }));

    showActionToast("Toss Complete");
  }

  async function finishMatch(resultData, finalScore, finalWickets) {
    await updateMatch(matchId, {
      status: "completed",
      winner: resultData.winner,
      result: resultData.result,
      secondInningsScore: finalScore,
      secondInningsWickets: finalWickets,
      completedAt: Date.now(),
    });
  }

  async function startSecondInningsFrom(firstInningsScore, firstInningsWickets) {
    await updateMatch(matchId, {
      status: "innings_break",
      firstInningsScore,
      firstInningsWickets,
      innings: 2,
      target: firstInningsScore + 1,
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
  }

  async function handleDelivery({
    label,
    commentaryText,
    teamRuns,
    batterRuns = 0,
    bowlerRuns = teamRuns,
    rotationRuns = teamRuns,
    isLegalDelivery,
    isWicket = false,
    batterBall = isLegalDelivery,
    dismissalType = null,
    fielder = null,
  }) {
    if (isUpdating || match.status === "completed" || match.status === "paused") return;

    if (!match.striker || !match.nonStriker || !match.currentBowler) {
      alert("Select batters and bowler first");
      return;
    }

    setIsUpdating(true);

    try {
      const before = createSnapshot(match);
      const previousTotalBalls = match.totalBalls || 0;
      const totalBalls = previousTotalBalls + (isLegalDelivery ? 1 : 0);
      const overComplete = isLegalDelivery && totalBalls % 6 === 0;
      const newScore = (match.score || 0) + teamRuns;
      const newWickets = (match.wickets || 0) + (isWicket ? 1 : 0);

      const striker = clonePlayer(match.striker);
      const nonStriker = clonePlayer(match.nonStriker);
      const bowler = clonePlayer(match.currentBowler);

      striker.runs = (striker.runs || 0) + batterRuns;
      striker.balls = (striker.balls || 0) + (batterBall ? 1 : 0);
      striker.fours = (striker.fours || 0) + (batterRuns === 4 ? 1 : 0);
      striker.sixes = (striker.sixes || 0) + (batterRuns === 6 ? 1 : 0);

      bowler.runs = (bowler.runs || 0) + bowlerRuns;
      bowler.balls = (bowler.balls || 0) + (isLegalDelivery ? 1 : 0);
      bowler.wickets = (bowler.wickets || 0) + (isWicket ? 1 : 0);

      const outPlayers = [...(match.outPlayers || [])];
      let nextStriker = striker;
      let nextNonStriker = nonStriker;

      if (isWicket) {
        outPlayers.push(match.striker.name);
        nextStriker = overComplete ? nonStriker : null;
        nextNonStriker = overComplete ? null : nonStriker;
      } else {
        if (rotationRuns % 2 === 1) {
          nextStriker = nonStriker;
          nextNonStriker = striker;
        }

        if (overComplete) {
          const temp = nextStriker;
          nextStriker = nextNonStriker;
          nextNonStriker = temp;
        }
      }

      const ballNumber = isLegalDelivery
        ? getNextBallLabel(previousTotalBalls)
        : calculateOvers(previousTotalBalls);

      const ballRecord = {
        label,
        over: ballNumber,
        type: isWicket ? "wicket" : "score",
        runs: teamRuns,
        batterRuns,
        bowlerRuns,
        isLegalDelivery,
        striker: match.striker.name,
        bowler: match.currentBowler.name,
        dismissalType,
        fielder,
        commentary: `${ballNumber} ${match.currentBowler.name} to ${match.striker.name}, ${commentaryText}`,
        before,
        createdAt: Date.now(),
      };
      const balls = getWritableEvents(match, "balls");
      const commentary = getWritableEvents(match, "commentary");

      const currentOver =
        previousTotalBalls % 6 === 0 && (match.currentOver || []).length >= 6
          ? [label]
          : [...(match.currentOver || []), label];

      const baseUpdate = {
        score: newScore,
        wickets: newWickets,
        totalBalls,
        overs: calculateOvers(totalBalls),
        currentOver,
        outPlayers,
        striker: nextStriker,
        nonStriker: nextNonStriker,
        currentBowler: bowler,
        balls: [...balls, compactBallRecord(ballRecord)],
        commentary: [...commentary, compactBallRecord(ballRecord)],
        bowlerChangeBefore: null,
        undoStack: pushHistory(getUndoStack(match), before),
        redoStack: [],
      };

      const inningsFinished = isInningsComplete({
        ...match,
        totalBalls,
        wickets: newWickets,
      });

      if (inningsFinished && match.innings === 1) {
        await updateMatch(matchId, baseUpdate);
        await startSecondInningsFrom(newScore, newWickets);
        return;
      }

      if (match.innings === 2) {
        const resultData = getMatchResult(match, newScore, newWickets, totalBalls);

        if (resultData) {
          await updateMatch(matchId, baseUpdate);
          await finishMatch(resultData, newScore, newWickets);
          return;
        }
      }

      await updateMatch(matchId, baseUpdate);

      if (isWicket && !inningsFinished) {
        setShowBatterModal(true);
      }

      if (overComplete && !inningsFinished) {
        setShowBowlerModal(true);
      }
    } finally {
      setIsUpdating(false);
    }
  }

  function handleScore(runs) {
    const text =
      runs === 0
        ? "dot ball"
        : runs === 4
          ? "FOUR"
          : runs === 6
            ? "SIX"
            : `${runs} run${runs === 1 ? "" : "s"}`;

    showActionToast(runs === 0 ? "Dot Ball" : `+${runs} Runs`);

    return handleDelivery({
      label: String(runs),
      commentaryText: text,
      teamRuns: runs,
      batterRuns: runs,
      bowlerRuns: runs,
      rotationRuns: runs,
      isLegalDelivery: true,
    });
  }

  function handleWicket() {
    if (!match.striker || !match.nonStriker || !match.currentBowler) {
      alert("Select batters and bowler first");
      return;
    }

    setShowDismissalModal(true);
  }

  function handleWicketDismissal({ dismissalType, fielder }) {
    const labels = {
      bowled: "BOWLED",
      caught: `CAUGHT by ${fielder || "-"}`,
      lbw: "LBW",
      run_out: `RUN OUT by ${fielder || "-"}`,
      stumped: `STUMPED by ${fielder || "-"}`,
      hit_wicket: "HIT WICKET",
    };

    setShowDismissalModal(false);
    showActionToast("Wicket");

    return handleDelivery({
      label: "W",
      commentaryText: labels[dismissalType] || "WICKET",
      teamRuns: 0,
      batterRuns: 0,
      bowlerRuns: 0,
      isLegalDelivery: true,
      isWicket: true,
      dismissalType,
      fielder,
    });
  }

  function handleWide(runs = 0) {
    const total = runs + 1;
    showActionToast(runs ? `Wide +${total}` : "Wide +1");

    return handleDelivery({
      label: runs ? `WD+${runs}` : "WD",
      commentaryText: runs ? `wide, ${runs} run${runs === 1 ? "" : "s"}` : "wide",
      teamRuns: total,
      batterRuns: 0,
      bowlerRuns: total,
      rotationRuns: runs,
      isLegalDelivery: false,
      batterBall: false,
    });
  }

  function handleNoBall(batRuns = 0) {
    const total = batRuns + 1;
    const text =
      batRuns === 0
        ? "no ball"
        : `no ball, ${batRuns} run${batRuns === 1 ? "" : "s"} off the bat`;

    showActionToast(batRuns ? `No Ball +${batRuns}` : "No Ball +1");

    return handleDelivery({
      label: batRuns ? `NB+${batRuns}` : "NB",
      commentaryText: text,
      teamRuns: total,
      batterRuns: batRuns,
      bowlerRuns: total,
      rotationRuns: batRuns,
      isLegalDelivery: false,
      batterBall: false,
    });
  }

  function handleBye(runs, isLegBye = false) {
    showActionToast(`${isLegBye ? "Leg Bye" : "Bye"} +${runs}`);

    return handleDelivery({
      label: `${isLegBye ? "LB" : "B"}${runs}`,
      commentaryText: `${runs} ${isLegBye ? "leg bye" : "bye"}${runs === 1 ? "" : "s"}`,
      teamRuns: runs,
      batterRuns: 0,
      bowlerRuns: 0,
      rotationRuns: runs,
      isLegalDelivery: true,
    });
  }

  async function handleUndo() {
    if (isUpdating) return;

    setIsUpdating(true);
    setShowBowlerModal(false);
    setShowBatterModal(false);

    try {
      const undoStack = getUndoStack(match);
      const redoStack = getRedoStack(match);

      if (undoStack.length) {
        const previousSnapshot = undoStack[undoStack.length - 1];
        const currentSnapshot = createRedoSnapshot(match, previousSnapshot);

        await updateMatch(matchId, {
          ...restoreSnapshot(previousSnapshot, match),
          undoStack: undoStack.slice(0, -1),
          redoStack: pushHistory(redoStack, currentSnapshot),
        });

        showActionToast("Undo");
        return;
      }

      if (match.bowlerChangeBefore) {
        const currentSnapshot = createSnapshot(match);

        await updateMatch(matchId, {
          ...match.bowlerChangeBefore,
          bowlerChangeBefore: null,
          balls: getWritableEvents(match, "balls"),
          commentary: getWritableEvents(match, "commentary"),
          redoStack: pushHistory(redoStack, currentSnapshot),
        });

        showActionToast("Undo");
        return;
      }

      const balls = getWritableEvents(match, "balls");
      const commentary = getWritableEvents(match, "commentary");
      if (!balls.length) return;

      const lastBall = balls.pop();
      if (commentary.length) commentary.pop();

      if (!lastBall.before) {
        alert("This ball was recorded before full undo snapshots were enabled.");
        return;
      }

      await updateMatch(matchId, {
        ...restoreSnapshot(lastBall.before, match),
        balls,
        commentary,
        bowlerChangeBefore: null,
        redoStack: pushHistory(redoStack, createRedoSnapshot(match, lastBall.before)),
      });

      showActionToast("Undo");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleRedo() {
    if (isUpdating) return;

    const redoStack = getRedoStack(match);

    if (!redoStack.length) return;

    setIsUpdating(true);
    setShowBowlerModal(false);
    setShowBatterModal(false);

    try {
      const nextSnapshot = redoStack[redoStack.length - 1];
      const currentSnapshot = createSnapshot(match);

      await updateMatch(matchId, {
        ...restoreSnapshot(nextSnapshot, match),
        undoStack: pushHistory(getUndoStack(match), currentSnapshot),
        redoStack: redoStack.slice(0, -1),
      });

      showActionToast("Redo");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleSwapStrike() {
    await updateMatch(matchId, {
      ...withUndoHistory({
        striker: match.nonStriker,
        nonStriker: match.striker,
      }),
    });
    showActionToast("Strike Swapped");
  }

  async function handlePauseMatch({ reason, note }) {
    await updateMatch(matchId, withUndoHistory({
      status: "paused",
      pauseReason: reason,
      pausedAt: Date.now(),
      matchNotes: [
        ...(match.matchNotes || []),
        {
          text: note || `Match paused: ${reason}`,
          role: "scorer",
          type: "pause",
          createdAt: Date.now(),
        },
      ],
    }));
    setShowPauseModal(false);
    showActionToast("Paused");
  }

  async function handleResumeMatch() {
    const note = prompt("Resume note", "Play resumes.");
    await updateMatch(matchId, withUndoHistory({
      status: "live",
      pauseReason: null,
      resumedAt: Date.now(),
      matchNotes: [
        ...(match.matchNotes || []),
        {
          text: note || "Play resumed.",
          role: "scorer",
          type: "resume",
          createdAt: Date.now(),
        },
      ],
    }));
    showActionToast("Resume");
  }

  async function handleDelayNote() {
    const note = prompt("Publish match note");

    if (!note) return;

    await updateMatch(matchId, withUndoHistory({
      matchNotes: [
        ...(match.matchNotes || []),
        {
          text: note,
          role: "scorer",
          type: "note",
          createdAt: Date.now(),
        },
      ],
    }));
    showActionToast("Note Added");
  }

  async function handleRetiredHurt() {
    if (!match.striker) {
      alert("Select a striker first");
      return;
    }

    const confirmed = confirm(`${match.striker.name} retired hurt?`);

    if (!confirmed) return;

    await updateMatch(matchId, withUndoHistory({
      striker: null,
      retiredHurtPlayers: [
        ...(match.retiredHurtPlayers || []),
        match.striker.name,
      ],
      matchNotes: [
        ...(match.matchNotes || []),
        {
          text: `${match.striker.name} retired hurt.`,
          role: "scorer",
          type: "retired_hurt",
          createdAt: Date.now(),
        },
      ],
    }));

    setShowBatterModal(true);
    showActionToast("Retired Hurt");
  }

  async function handleNewBatter(playerName) {
    const newBatter = {
      name: playerName,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
    };

    const selectingStriker = !match.striker;
    const selectingNonStriker = !selectingStriker && !match.nonStriker;

    setShowBatterModal(false);

    if (selectingStriker) {
      await updateMatch(matchId, {
        ...withUndoHistory({
          striker: newBatter,
        }),
      });

      if (match.nonStriker && !match.currentBowler) {
        setShowBowlerModal(true);
      }

      showActionToast("Batter Selected");
      return;
    }

    if (selectingNonStriker) {
      await updateMatch(matchId, {
        ...withUndoHistory({
          nonStriker: newBatter,
        }),
      });

      if (!match.currentBowler) {
        setShowBowlerModal(true);
      }
      showActionToast("Batter Selected");
      return;
    }

    await updateMatch(matchId, {
      ...withUndoHistory({
        striker: newBatter,
      }),
    });
    showActionToast("Batter Selected");
  }

  async function handleNewBowler(playerName) {
    const newBowler = {
      name: playerName,
      runs: 0,
      wickets: 0,
      balls: 0,
    };
    const isOverBreak =
      (match.totalBalls || 0) > 0 &&
      (match.totalBalls || 0) % 6 === 0;

    await updateMatch(matchId, withUndoHistory({
      currentBowler: newBowler,
      currentOver: isOverBreak ? [] : match.currentOver || [],
      bowlerChangeBefore: isOverBreak
        ? {
            currentBowler: clonePlayer(match.currentBowler),
            currentOver: [...(match.currentOver || [])],
          }
        : null,
    }));

    setShowBowlerModal(false);
    showActionToast("Bowler Selected");
  }

  return (
    <main className="min-h-screen bg-[#050B18] p-4 text-white sm:p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[var(--vs-gold)] text-sm">SCORER PANEL</p>

            <h1 className="text-4xl md:text-5xl font-black mt-2">
              {match.teamA} vs {match.teamB}
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleUndo}
              disabled={!undoStack.length && !match.balls?.length && !match.bowlerChangeBefore}
              className="h-14 min-w-24 rounded-xl bg-red-700 px-5 font-bold text-white disabled:opacity-50"
            >
              UNDO
            </button>

            <button
              onClick={handleRedo}
              disabled={!redoStack.length}
              className="h-14 min-w-24 rounded-xl bg-[#D4AF37] px-5 font-bold text-[#06152F] disabled:opacity-50"
            >
              REDO
            </button>
          </div>
        </div>

        <ScorerActionToast message={actionToast} />

        {match.status === "completed" && (
          <div className="bg-[#101D35] rounded-3xl p-8 text-center">
            <h2 className="text-4xl font-black">MATCH COMPLETED</h2>
            <p className="mt-4 text-2xl">{resultText}</p>
            <p className="mt-2 text-slate-400">
              Winner: {match.winner || "No winner"}
            </p>
          </div>
        )}

        {match.status !== "completed" && (
          <div className="rounded-3xl border border-white/10 bg-[#101D35] p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-[var(--vs-gold)]">
                  Match Operations
                </p>
                <p className="mt-1 text-slate-400">
                  Scorer permissions: pause, resume, delay notes, retired hurt.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {match.status === "paused" ? (
                  <button
                    onClick={handleResumeMatch}
                    className="h-14 min-w-24 rounded-xl bg-green-600 px-5 font-bold text-white"
                  >
                    Resume
                  </button>
                ) : (
                  <button
                    onClick={() => setShowPauseModal(true)}
                    className="h-14 min-w-24 rounded-xl bg-[#F28C28] px-5 font-bold text-[#06152F]"
                  >
                    Pause
                  </button>
                )}

                <button
                  onClick={handleDelayNote}
                  className="h-14 rounded-xl bg-[#1B2A49] px-5 font-bold text-white"
                >
                  Add Delay Note
                </button>

                <button
                  onClick={handleRetiredHurt}
                  disabled={!match.striker || match.status === "paused"}
                  className="h-14 rounded-xl bg-[#F5C542] px-5 font-bold text-[#06152F] disabled:opacity-50"
                >
                  Retired Hurt
                </button>
              </div>
            </div>

            {match.status === "paused" && (
              <p className="mt-4 rounded-xl bg-orange-500/10 p-3 font-bold text-orange-300">
                Match paused: {match.pauseReason || "Delay"}
              </p>
            )}
          </div>
        )}

        <div className="bg-[#101D35] rounded-3xl p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-slate-400">{match.battingTeam} batting</p>
              <div className="flex items-end gap-4 mt-2">
                <h2 className="text-6xl md:text-8xl font-black">
                  {match.score}/{match.wickets}
                </h2>
                <p className="text-2xl md:text-3xl text-slate-400 mb-2">
                  ({match.overs})
                </p>
              </div>
            </div>

            {match.target && (
              <div className="text-left lg:text-right">
                <p className="text-slate-400">Target</p>
                <p className="text-4xl font-black text-[var(--vs-gold)]">
                  {match.target}
                </p>
              </div>
            )}
          </div>

          {match.revisedTargetApplied && (
            <div className="mt-6 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-4">
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-300">
                Target Revised
              </p>
              <p className="mt-1 text-xl font-black text-yellow-200">
                {match.revisedTarget} runs from {match.revisedOvers} overs
              </p>
              <p className="mt-1 text-slate-300">{match.revisionReason}</p>
            </div>
          )}

          <div className="mt-8 space-y-3">
            <p className="text-slate-400 text-sm uppercase tracking-widest">
              Current Over
            </p>
            <CurrentOver balls={match.currentOver || []} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <BatterCard batter={match.striker} isStriker={true} />
          <BatterCard batter={match.nonStriker} isStriker={false} />

          <div className="bg-[#101D35] rounded-2xl p-6">
            <p className="text-slate-400">Current Bowler</p>
            <h3 className="text-2xl font-black mt-2">
              {match.currentBowler?.name || "Select Bowler"}
            </h3>
            <div className="flex gap-6 mt-6 text-slate-300">
              <p>O: {bowlerOvers}</p>
              <p>R: {match.currentBowler?.runs || 0}</p>
              <p>W: {match.currentBowler?.wickets || 0}</p>
            </div>
          </div>
        </div>

        {needsToss && match.status !== "completed" && (
          <div className="bg-[#101D35] rounded-3xl p-8">
            <h2 className="text-3xl font-black">TOSS SETUP</h2>
            <p className="text-slate-400 mt-3">
              Conduct toss, select the winner and decision, then start scoring.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label>
                <span className="text-sm font-semibold text-slate-400">
                  Select Toss Winner
                </span>
                <select
                  value={tossWinnerInput}
                  onChange={(event) => setTossWinnerInput(event.target.value)}
                  className="mt-2 h-14 w-full rounded-xl border border-white/10 bg-[#0A1428] px-4 text-white"
                >
                  <option value="">Toss Winner</option>
                  <option value={match.teamA}>{match.teamA}</option>
                  <option value={match.teamB}>{match.teamB}</option>
                </select>
              </label>

              <label>
                <span className="text-sm font-semibold text-slate-400">
                  Select Toss Decision
                </span>
                <select
                  value={tossDecisionInput}
                  onChange={(event) => setTossDecisionInput(event.target.value)}
                  className="mt-2 h-14 w-full rounded-xl border border-white/10 bg-[#0A1428] px-4 text-white"
                >
                  <option value="">Decision</option>
                  <option value="bat">Bat</option>
                  <option value="bowl">Bowl</option>
                </select>
              </label>
            </div>

            <button
              onClick={handleConductToss}
              className="mt-6 h-14 rounded-xl bg-green-600 px-6 font-black text-white"
            >
              Start Scoring
            </button>
          </div>
        )}

        {!needsToss && (needsBatter || needsBowler || match.status === "innings_break") && (
          <div className="bg-[#101D35] rounded-3xl p-8 text-center">
            <h2 className="text-3xl font-black">
              {match.status === "innings_break"
                ? "SECOND INNINGS SETUP"
                : "MATCH SETUP REQUIRED"}
            </h2>

            <p className="text-slate-400 mt-4">
              Select striker, non-striker and bowler before scoring.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button
                onClick={() => setShowBatterModal(true)}
                disabled={!!match.striker && !!match.nonStriker}
                className="h-14 rounded-xl bg-[#D4AF37] px-6 font-bold text-[#06152F] disabled:opacity-50"
              >
                Select Striker
              </button>

              <button
                onClick={() => setShowBatterModal(true)}
                disabled={!match.striker || !!match.nonStriker}
                className="h-14 rounded-xl bg-blue-600 px-6 font-bold text-white disabled:opacity-50"
              >
                Select Non-Striker
              </button>

              <button
                onClick={() => setShowBowlerModal(true)}
                className="h-14 rounded-xl bg-purple-600 px-6 font-bold text-white"
              >
                Select Bowler
              </button>
            </div>

            {match.status === "innings_break" && (
              <button
                disabled={!match.striker || !match.nonStriker || !match.currentBowler}
                onClick={startSecondInningsPlay}
                className="mt-8 h-16 rounded-xl bg-green-600 px-8 text-xl font-bold text-white disabled:opacity-50"
              >
                START SECOND INNINGS
              </button>
            )}
          </div>
        )}

        {match.status !== "completed" &&
          match.status !== "innings_break" &&
          match.status !== "paused" &&
          !needsToss && (
          <BallControls
            disabled={isUpdating}
            onScore={handleScore}
            onWicket={handleWicket}
            onWide={handleWide}
            onNoBall={handleNoBall}
            onBye={handleBye}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onSwapStrike={handleSwapStrike}
          />
        )}

        {match.status === "paused" && (
          <div className="rounded-3xl bg-[#101D35] p-8 text-center">
            <h2 className="text-3xl font-black text-orange-300">
              SCORING PAUSED
            </h2>
            <p className="mt-3 text-slate-400">
              Resume the match before entering another delivery.
            </p>
          </div>
        )}

        {!!latestNotes.length && <MatchNotesPanel notes={latestNotes} />}
      </div>

      {showBatterModal && (
        <NewBatterModal
          open
          title={
            !match.striker
              ? "Select Striker"
              : !match.nonStriker
                ? "Select Non-Striker"
                : "Select New Batter"
          }
          players={match.battingTeamPlayers || []}
          currentStriker={match.striker?.name}
          currentNonStriker={match.nonStriker?.name}
          outPlayers={match.outPlayers || []}
          onSelect={handleNewBatter}
        />
      )}

      {showBowlerModal && (
        <NewBowlerModal
          open
          players={match.bowlingTeamPlayers || []}
          currentBowler={match.currentBowler?.name}
          onSelect={handleNewBowler}
        />
      )}

      {showDismissalModal && (
        <DismissalModal
          fielders={match.bowlingTeamPlayers || []}
          onClose={() => setShowDismissalModal(false)}
          onSelect={handleWicketDismissal}
        />
      )}

      {showPauseModal && (
        <PauseReasonModal
          onClose={() => setShowPauseModal(false)}
          onSubmit={handlePauseMatch}
        />
      )}
    </main>
  );
}

function ScorerActionToast({ message }) {
  if (!message) return null;

  return (
    <div className="pointer-events-none fixed left-1/2 top-24 z-[70] -translate-x-1/2 rounded-2xl border border-[var(--vs-gold)]/30 bg-[#071224]/95 px-5 py-3 text-center text-lg font-black text-white shadow-2xl">
      {message}
    </div>
  );
}
