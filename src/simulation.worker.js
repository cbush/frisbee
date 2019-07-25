/* eslint-env worker */
/* eslint no-restricted-globals: 1 */
import PD from "probability-distributions";

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
  while (true) {
    if (possessor != null || !possessor.isOpponent) {
      // Team has the disc

      const throwsGoal = PD.sample([true, false], 1, false, [
        possessor.assistRate,
        1 - possessor.assistRate
      ]);

      if (throwsGoal) {
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

      if (!passSuccess) {
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
        team.map(member => team.targetRate)
      )[0];

      const passCaught = PD.sample([true, false], 1, false, [
        target.catchRate,
        1 - target.catchRate
      ]);

      if (!passCaught) {
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
      const N = 3;
      const opponentScored = PD.rint(1, 0, N - 1)[0] === 0;
      if (opponentScored) {
        break;
      }
    }
  }
};

const simulatePoints = config => {
  const points = [];
  while (points.length < 100) {
    points.push(simulatePoint(config));
  }
  return points;
};

const simulate = ({ team }) => {
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
  const result = simulate(event.data);
  const endTime = new Date();
  self.postMessage({
    elapsedMs: endTime - startTime,
    result
  });
};
