import { ref, get, update } from "firebase/database";

import { db } from "@/Lib/firebase";

import { calculateMatchStatus } from "./calculateMatchStatus";

let isUpdating = false;

export async function updateMatch(eventType) {

  // PREVENT DOUBLE CLICKS
  if (isUpdating) return;

  isUpdating = true;

  try {

    const matchRef = ref(db, "liveMatch");

    const snapshot = await get(matchRef);

    const match = snapshot.val();

    if (!match) return;

    let {
      score = 0,
      wickets = 0,
      overs = 0,
      balls = 0,

      currentOver = [],

      target = 0,
      totalOvers = 20,

      battingTeam = "",

      striker = "",
      nonStriker = "",

      ballHistory = [],

      lastBallEvent = "",
    } = match;

    // SAVE SNAPSHOT FOR UNDO
    ballHistory = [
      ...ballHistory,
      {
        score,
        wickets,
        overs,
        balls,
        currentOver: [...currentOver],
      },
    ];

    switch (eventType) {

      case "RUN_1":

        score += 1;
        balls += 1;

        currentOver = [...currentOver, "1"];

        lastBallEvent = "1 RUN";

        break;

      case "RUN_2":

        score += 2;
        balls += 1;

        currentOver = [...currentOver, "2"];

        lastBallEvent = "2 RUNS";

        break;

      case "RUN_3":

        score += 3;
        balls += 1;

        currentOver = [...currentOver, "3"];

        lastBallEvent = "3 RUNS";

        break;

      case "RUN_4":

        score += 4;
        balls += 1;

        currentOver = [...currentOver, "4"];

        lastBallEvent = "FOUR";

        break;

      case "RUN_6":

        score += 6;
        balls += 1;

        currentOver = [...currentOver, "6"];

        lastBallEvent = "SIX";

        break;

      case "WIDE":

        score += 1;

        currentOver = [...currentOver, "Wd"];

        lastBallEvent = "WIDE";

        break;

      case "NO_BALL":

        score += 1;

        currentOver = [...currentOver, "Nb"];

        lastBallEvent = "NO BALL";

        break;

      case "WICKET":

        wickets += 1;
        balls += 1;

        currentOver = [...currentOver, "W"];

        lastBallEvent = "WICKET";

        break;

      case "CHANGE_STRIKE":

        [striker, nonStriker] =
          [nonStriker, striker];

        lastBallEvent = "STRIKE ROTATED";

        break;

      case "NEXT_OVER":

        overs += 1;
        balls = 0;

        lastBallEvent = "OVER COMPLETE";

        break;

      case "UNDO":

        const previous =
          ballHistory[ballHistory.length - 2];

        if (previous) {

          score = previous.score;
          wickets = previous.wickets;
          overs = previous.overs;
          balls = previous.balls;

          currentOver = [...previous.currentOver];

          // REMOVE CURRENT SNAPSHOT
          ballHistory = ballHistory.slice(0, -1);

          lastBallEvent = "UNDO";

        }

        break;

      default:
        break;
    }

    // AUTO OVER COMPLETE
    if (balls >= 6) {

      overs += 1;

      balls = 0;

      lastBallEvent = "OVER COMPLETE";

    }

    // MATCH STATUS
    const status = calculateMatchStatus({
      target,
      score,
      overs,
      balls,
      totalOvers,
      battingTeam,
    });

    // FIREBASE UPDATE
    await update(matchRef, {
      score,
      wickets,
      overs,
      balls,

      currentOver,

      striker,
      nonStriker,

      status,

      ballHistory,

      lastBallEvent,
    });

  } catch (error) {

    console.error("Match Update Error:", error);

  } finally {

    isUpdating = false;

  }
}
