import React from "react";
export function MultiResultTable({ playerStats }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Goals Avg</th>
          <th>Goals Stdev</th>
          <th>Assists Avg</th>
          <th>Assists Stdev</th>
          <th>Passes Avg</th>
          <th>Passes Stdev</th>
          <th>Incompletes Avg</th>
          <th>Incompletes Stdev</th>
          <th>Catches Avg</th>
          <th>Catches Stdev</th>
          <th>Drops Avg</th>
          <th>Drops Stdev</th>
          <th>Blocks Avg</th>
          <th>Blocks Stdev</th>
        </tr>
      </thead>
      <tbody>
        {Object.values(playerStats).map(
          ({
            name,
            goalsAvg,
            goalsStdev,
            assistsAvg,
            assistsStdev,
            passesAvg,
            passesStdev,
            incompletesAvg,
            incompletesStdev,
            catchesAvg,
            catchesStdev,
            dropsAvg,
            dropsStdev,
            blocksAvg,
            blocksStdev
          }) => {
            return (
              <tr key={name}>
                <td>{name}</td>
                <td>{goalsAvg}</td>
                <td>{goalsStdev}</td>
                <td>{assistsAvg}</td>
                <td>{assistsStdev}</td>
                <td>{passesAvg}</td>
                <td>{passesStdev}</td>
                <td>{incompletesAvg}</td>
                <td>{incompletesStdev}</td>
                <td>{catchesAvg}</td>
                <td>{catchesStdev}</td>
                <td>{dropsAvg}</td>
                <td>{dropsStdev}</td>
                <td>{blocksAvg}</td>
                <td>{blocksStdev}</td>
              </tr>
            );
          }
        )}
      </tbody>
    </table>
  );
}
