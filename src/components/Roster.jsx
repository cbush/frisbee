import React from "react";
import { Player } from "./Player";

export function Roster({
  name,
  players,
  detailed,
  onPlayerActionClicked,
  playerActionDisabled,
  playerActionText
}) {
  return (
    <div className="roster">
      <h1>{name}</h1>
      {players.map(player => (
        <Player
          key={player.name}
          player={player}
          detailed={detailed}
          actionDisabled={playerActionDisabled}
          onActionClicked={() => onPlayerActionClicked(player)}
          actionText={playerActionText}
        />
      ))}
    </div>
  );
}
