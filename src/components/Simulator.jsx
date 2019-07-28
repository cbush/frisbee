import React, { useState } from "react";
import "rc-slider/assets/index.css";
import { withPlayers } from "./withPlayers";
import { Roster } from "./Roster";
import { Results } from "./Results";
import { ConfigurationSlider } from "./ConfigurationSlider";

export const Simulator = withPlayers(({ players }) => {
  const [team, setTeam] = useState([]);
  const [opponentScoreRate, setOpponentScoreRate] = useState(0.59);
  const [opponentDropRate, setOpponentDropRate] = useState(0.37);
  const [teamBlockRate, setTeamBlockRate] = useState(0.07);

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
        />
        <ConfigurationSlider
          label="Opponent drop rate"
          defaultValue={opponentDropRate}
          setValue={setOpponentDropRate}
        />
        <ConfigurationSlider
          label="Team block rate"
          defaultValue={teamBlockRate}
          setValue={setTeamBlockRate}
        />
      </div>
      <h1>Results</h1>
      <Results
        opponentScoreRate={opponentScoreRate}
        opponentDropRate={opponentDropRate}
        teamBlockRate={teamBlockRate}
        pointCount={1000}
        team={team}
        teamSize={teamSize}
      />
    </div>
  );
});
