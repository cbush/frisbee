/* eslint-env worker */
/* eslint no-restricted-globals: 1 */
import PD from "probability-distributions";
import Stats from "stats-lite";
import { isNumber } from "util";

const randomBool = probabilityOfTrue => {
  return PD.sample([true, false], 1, false, [
    probabilityOfTrue,
    1 - probabilityOfTrue
  ])[0];
};

const simulatePoint = ({
  teamBlockRate,
  opponentScoreRate,
  opponentDropRate,
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

  // Continue until a point is scored
  while (true) {
    if (possessor != null) {
      // Team has the disc

      const passSuccess = randomBool(possessor.throwRate);

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

      const passCaught = randomBool(target.catchRate);

      if (passCaught === false) {
        onDrop(target.name);
        possessor = null;
        continue;
      }

      onCatch(target.name);

      const wasGoal = randomBool(possessor.assistRate);

      if (wasGoal === true) {
        onAssist(possessor.name);
        onGoalScored(target.name);
        break;
      }

      // Possession moves to target.
      possessor = target;

      // Play continues until goal is scored
    } else {
      // Opponent has the disc

      // Team attempts to block
      const didBlock = randomBool(teamBlockRate);

      if (didBlock === true) {
        possessor = PD.sample(
          team,
          1,
          false,
          team.map(member => member.blockRate)
        )[0];

        // Team blocked and gained possession.
        onBlock(possessor.name);
        continue;
      }

      // Team did not block.
      // Opponent has a chance to score.
      const opponentScored = randomBool(opponentScoreRate);
      if (opponentScored === true) {
        break;
      }

      // Opponent has a chance to drop.
      const opponentDropped = randomBool(opponentDropRate);
      if (opponentDropped === true) {
        // Pick a new team member at random to take possession
        possessor = PD.sample(team, 1)[0];
        continue;
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

const simulate = ({
  team,
  pointCount,
  teamBlockRate,
  opponentScoreRate,
  opponentDropRate
}) => {
  const playerStats = {};
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
    team,
    teamBlockRate,
    opponentScoreRate,
    opponentDropRate,
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

const getAverage = (results, name, prop) => {
  return Stats.mean(
    results.map(playerStats => playerStats[name][prop])
  ).toFixed(3);
};

const getStdev = (results, name, prop) => {
  return Stats.stdev(
    results.map(playerStats => playerStats[name][prop])
  ).toFixed(3);
};

const simulateMulti = ({ iterationCount, ...data }) => {
  const { team, pointCount } = data;
  const results = [];
  for (let i = 0; i < iterationCount; ++i) {
    results.push(simulate({ ...data, team, pointCount }));
  }
  const playerStats = {};
  team.forEach(member => {
    const { name } = member;
    playerStats[name] = {
      name,
      goalsAvg: getAverage(results, name, "goals"),
      goalsStdev: getStdev(results, name, "goals"),
      assistsAvg: getAverage(results, name, "assists"),
      assistsStdev: getStdev(results, name, "assists"),
      passesAvg: getAverage(results, name, "passes"),
      passesStdev: getStdev(results, name, "passes"),
      incompletesAvg: getAverage(results, name, "incompletes"),
      incompletesStdev: getStdev(results, name, "incompletes"),
      catchesAvg: getAverage(results, name, "catches"),
      catchesStdev: getStdev(results, name, "catches"),
      dropsAvg: getAverage(results, name, "drops"),
      dropsStdev: getStdev(results, name, "drops"),
      blocksAvg: getAverage(results, name, "blocks"),
      blocksStdev: getStdev(results, name, "blocks")
    };
  });
  return playerStats;
};

const getPointCount = ({ pointCount, iterationCount, multiMode }) => {
  if (!multiMode) {
    return pointCount;
  }
  if (!isNumber(iterationCount) || iterationCount <= 0) {
    throw new Error(`Invalid iterationCount: ${iterationCount}`);
  }
  return parseInt(pointCount / iterationCount);
};

onmessage = event => {
  const startTime = new Date();
  const { multiMode } = event.data;
  const pointCount = getPointCount(event.data);
  let playerStats;
  if (multiMode === true) {
    playerStats = simulateMulti({ ...event.data, pointCount });
  } else {
    playerStats = simulate({ ...event.data, pointCount });
  }
  const endTime = new Date();
  self.postMessage({
    elapsedMs: endTime - startTime,
    pointCount,
    iterationCount: event.data.iterationCount,
    playerStats
  });
};
