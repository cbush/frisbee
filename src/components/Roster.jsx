import React from "react";
import { Player } from "./Player";

export function Roster({
  players,
  detailed,
  onPlayerActionClicked,
  playerActionDisabled,
  playerActionText
}) {
  return (
    <div className="roster">
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
