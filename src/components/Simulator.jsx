import React, { useState } from "react";
import { Checkbox } from "semantic-ui-react";
import "rc-slider/assets/index.css";
import "semantic-ui-css/semantic.min.css";
import { withPlayers } from "./withPlayers";
import { Roster } from "./Roster";
import { Results } from "./Results";
import { ConfigurationSlider } from "./ConfigurationSlider";

export const Simulator = withPlayers(({ players }) => {
  const [team, setTeam] = useState([]);
  const [opponentScoreRate, setOpponentScoreRate] = useState(0.59);
  const [opponentDropRate, setOpponentDropRate] = useState(0.37);
  const [teamBlockRate, setTeamBlockRate] = useState(0.07);
  const [pointCount, setPointCount] = useState(1000);
  const [pointCountPerIteration, setPointCountPerIteration] = useState(30);
  const [multiMode, setMultiMode] = useState(false);
  const [iterationCount, setIterationCount] = useState(30);

  const isOnTeam = player => team.find(member => member.name === player.name);

  const teamSize = 7;
  const teamIsFull = team.length === teamSize;
  return (
    <div className="simulator">
      <h1>Bench</h1>
      <Roster
        players={players.filter(player => !isOnTeam(player))}
        playerActionText="Add to Line"
        playerActionDisabled={teamIsFull}
        onPlayerActionClicked={player => setTeam([...team, player])}
      />
      <h1>Line {teamIsFull ? "(Full)" : ""}</h1>
      {team.length === 0 ? (
        <p>
          Add players from the Bench{" "}
          <span role="img" aria-label="Point up">
            👆
          </span>
        </p>
      ) : (
        <Roster
          players={players.filter(player => isOnTeam(player))}
          playerActionText="Remove from Line"
          onPlayerActionClicked={player => {
            setTeam(team.filter(member => member.name !== player.name));
          }}
          playerActionDisabled={false}
        />
      )}
      <h1>Configuration</h1>
      <div className="configuration">
        <ConfigurationSlider
          label="Opponent score rate"
          defaultValue={opponentScoreRate}
          setValue={setOpponentScoreRate}
          min={0}
          max={1}
          step={0.01}
        />
        <ConfigurationSlider
          label="Opponent drop rate"
          defaultValue={opponentDropRate}
          setValue={setOpponentDropRate}
          min={0}
          max={1}
          step={0.01}
        />
        <ConfigurationSlider
          label="Team block rate"
          defaultValue={teamBlockRate}
          setValue={setTeamBlockRate}
          min={0}
          max={1}
          step={0.01}
        />
        {multiMode ? (
          <ConfigurationSlider
            key="pointsPerIteration"
            label="Points per iteration"
            defaultValue={pointCountPerIteration}
            setValue={setPointCountPerIteration}
            min={1}
            max={100}
            step={1}
          />
        ) : (
          <ConfigurationSlider
            key="pointsSimulated"
            label="Points simulated"
            defaultValue={pointCount}
            setValue={setPointCount}
            min={25}
            max={10000}
            step={25}
          />
        )}
        <div className="configurationSlider">
          <label>Multi mode</label>
          <Checkbox
            toggle
            checked={multiMode}
            onChange={() => setMultiMode(!multiMode)}
          />
        </div>
        {multiMode ? (
          <ConfigurationSlider
            label="Iteration Count"
            defaultValue={iterationCount}
            setValue={setIterationCount}
            min={1}
            max={100}
            step={1}
          />
        ) : null}
      </div>
      <h1>Results</h1>
      <Results
        multiMode={multiMode}
        iterationCount={iterationCount}
        opponentScoreRate={opponentScoreRate}
        opponentDropRate={opponentDropRate}
        teamBlockRate={teamBlockRate}
        pointCount={multiMode ? pointCountPerIteration : pointCount}
        team={team}
        teamSize={teamSize}
      />
    </div>
  );
});
