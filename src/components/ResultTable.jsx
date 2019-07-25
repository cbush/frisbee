import React from "react";
export function ResultTable({ playerStats }) {
  let totalGoals = 0;
  let totalAssists = 0;
  let totalPasses = 0;
  let totalIncompletes = 0;
  let totalCatches = 0;
  let totalDrops = 0;
  let totalBlocks = 0;
  Object.values(playerStats).forEach(
    ({ goals, assists, passes, incompletes, catches, drops, blocks }) => {
      totalGoals += goals;
      totalAssists += assists;
      totalPasses += passes;
      totalIncompletes += incompletes;
      totalCatches += catches;
      totalDrops += drops;
      totalBlocks += blocks;
    }
  );
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Goals</th>
          <th>Assists</th>
          <th>Passes</th>
          <th>Incompletes</th>
          <th>Catches</th>
          <th>Drops</th>
          <th>Blocks</th>
        </tr>
      </thead>
      <tbody>
        {Object.values(playerStats).map(
          ({
            name,
            goals,
            assists,
            passes,
            incompletes,
            catches,
            drops,
            blocks
          }) => {
            return (
              <tr key={name}>
                <td>{name}</td>
                <td>{goals}</td>
                <td>{assists}</td>
                <td>{passes}</td>
                <td>{incompletes}</td>
                <td>{catches}</td>
                <td>{drops}</td>
                <td>{blocks}</td>
              </tr>
            );
          }
        )}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">Totals</th>
          <td>{totalGoals}</td>
          <td>{totalAssists}</td>
          <td>{totalPasses}</td>
          <td>{totalIncompletes}</td>
          <td>{totalCatches}</td>
          <td>{totalDrops}</td>
          <td>{totalBlocks}</td>
        </tr>
      </tfoot>
    </table>
  );
}
