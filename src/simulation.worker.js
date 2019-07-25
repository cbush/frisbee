/* eslint-env worker */
/* eslint no-restricted-globals: 1 */
import PD from "probability-distributions";
import { isNumber } from "util";

const simulatePoint = ({
  players,
  team,
  onGoalScored,
  onAssist,
  onPassThrown,
  onPassIncomplete,
  onCatch,
  onDrop,
  onBlock
}) => {
  let possessor = null;
  let assistant = null;

  // Continue until a point is scored
  while (true) {
    if (possessor != null && !possessor.isOpponent) {
      // Team has the disc

      const throwsGoal = PD.sample([true, false], 1, false, [
        possessor.assistRate, // ??? No stat provided for goal rate
        1 - possessor.assistRate
      ])[0];

      if (throwsGoal === true) {
        onGoalScored(possessor.name);
        if (assistant != null) {
          onAssist(assistant.name);
        }
        break;
      }

      const passSuccess = PD.sample([true, false], 1, false, [
        possessor.throwRate,
        1 - possessor.throwRate
      ])[0];

      if (passSuccess === false) {
        onPassIncomplete(possessor.name);
        possessor = null;
        continue;
      }

      onPassThrown(possessor.name);

      // Decide who will receive the pass
      const target = PD.sample(
        team,
        1,
        false,
        team.map(member => member.targetRate)
      )[0];

      const passCaught = PD.sample([true, false], 1, false, [
        target.catchRate,
        1 - target.catchRate
      ])[0];

      if (passCaught === false) {
        onDrop(target.name);
        possessor = null;
        continue;
      }

      onCatch(target.name);

      // Possession moves to target. Last possessor becomes potential assistant
      assistant = possessor;
      possessor = target;
    } else {
      // Opponent has the disc

      // Clear assist
      assistant = null;

      // Team attempts to block
      possessor = PD.sample(
        players,
        1,
        false,
        players.map(player => player.blockRate)
      )[0];

      if (!possessor.isOpponent) {
        // Team blocked and gained possession.
        onBlock(possessor.name);
        continue;
      }

      // Team did not block. Opponent has a 1 in N chance to score.
      const N = 3; // ????
      const opponentScored = PD.rint(1, 0, N - 1)[0] === 0;
      if (opponentScored) {
        break;
      }
    }
  }
};

const simulatePoints = config => {
  const points = [];
  const { pointCount } = config;
  if (!isNumber(pointCount)) {
    throw new Error(`Invalid 'pointCount': ${pointCount}`);
  }
  while (points.length < pointCount) {
    points.push(simulatePoint(config));
  }
  return points;
};

const simulate = ({ team, pointCount }) => {
  const playerStats = {};
  const teamBlockRate = team
    .map(member => member.blockRate)
    .reduce((acc, cur) => acc + cur, 0);
  const players = [
    ...team,
    {
      name: "opponent",
      assistRate: 0,
      throwRate: 0,
      targetRate: 0,
      catchRate: 0,
      blockRate: 1 - teamBlockRate,
      isOpponent: true
    }
  ];
  team.forEach(
    member =>
      (playerStats[member.name] = {
        name: member.name,
        goals: 0,
        assists: 0,
        passes: 0,
        incompletes: 0,
        catches: 0,
        drops: 0,
        blocks: 0
      })
  );
  simulatePoints({
    pointCount,
    players,
    team,
    teamBlockRate,
    onGoalScored: name => (playerStats[name].goals += 1),
    onAssist: name => (playerStats[name].assists += 1),
    onPassThrown: name => (playerStats[name].passes += 1),
    onPassIncomplete: name => (playerStats[name].incompletes += 1),
    onCatch: name => (playerStats[name].catches += 1),
    onDrop: name => (playerStats[name].drops += 1),
    onBlock: name => (playerStats[name].blocks += 1)
  });
  return playerStats;
};

onmessage = event => {
  const startTime = new Date();
  const playerStats = simulate(event.data);
  const endTime = new Date();
  self.postMessage({
    elapsedMs: endTime - startTime,
    pointCount: event.data.pointCount,
    playerStats
  });
};
