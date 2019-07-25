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
        playerActionText="Add to Team"
        playerActionDisabled={team.length === 7}
        onPlayerActionClicked={player => setTeam([...team, player])}
      />
      <h1>Line {teamIsFull ? "(Full)" : ""}</h1>
      <Roster
        players={players.filter(player => isOnTeam(player))}
        playerActionText="Remove from Team"
        onPlayerActionClicked={player => {
          setTeam(team.filter(member => member.name !== player.name));
        }}
        playerActionDisabled={false}
      />
      <h1>Results</h1>
      <Results team={team} teamSize={teamSize} />
    </div>
  );
});
