import React, { useState } from "react";
import { withPlayers } from "./withPlayers";
import { Roster } from "./Roster";
import { Results } from "./Results";

export const Simulator = withPlayers(({ players }) => {
  const [team, setTeam] = useState([]);

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
      <h1>Results</h1>
      <Results
        opponentScoreRate={0.9}
        opponentDropRate={0.1}
        teamBlockRate={0.1}
        pointCount={1000}
        team={team}
        teamSize={teamSize}
      />
    </div>
  );
});
