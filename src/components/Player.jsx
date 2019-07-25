import React from "react";
export function Player({
  player,
  detailed,
  actionDisabled,
  onActionClicked,
  actionText
}) {
  const {
    name,
    assistRate,
    throwRate,
    targetRate,
    catchRate,
    blockRate
  } = player;
  return (
    <div className="player">
      <label>Player</label>
      <h1>{name}</h1>
      {detailed === true ? (
        <table>
          <thead>
            <tr>
              <th>Assist %</th>
              <th>Throw %</th>
              <th>Target %</th>
              <th>Catch %</th>
              <th>Ds per PP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{assistRate}</td>
              <td>{throwRate}</td>
              <td>{targetRate}</td>
              <td>{catchRate}</td>
              <td>{blockRate}</td>
            </tr>
          </tbody>
        </table>
      ) : null}
      <button disabled={actionDisabled} onClick={onActionClicked}>
        {actionText}
      </button>
    </div>
  );
}
