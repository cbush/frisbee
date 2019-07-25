import React, { useState } from "react";
import { withPlayers } from "./withPlayers";
import { Roster } from "./Roster";

export const Simulator = withPlayers(({ players }) => {
  const [team, setTeam] = useState([]);

  const isOnTeam = player => team.find(member => member.name === player.name);

  return (
    <div className="simulator">
      <Roster
        name="Bench"
        players={players.filter(player => !isOnTeam(player))}
        playerActionText="Add to Team"
        playerActionDisabled={team.length === 7}
        onPlayerActionClicked={player => setTeam([...team, player])}
      />
      <Roster
        name="Team"
        players={players.filter(player => isOnTeam(player))}
        playerActionText="Remove from Team"
        onPlayerActionClicked={player => {
          setTeam(team.filter(member => member.name !== player.name));
        }}
        playerActionDisabled={false}
      />
    </div>
  );
});
