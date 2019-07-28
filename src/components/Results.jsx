import React from "react";
import SimulationWorker from "../simulation.worker";
import { ResultTable } from "./ResultTable";
import { MultiResultTable } from "./MultiResultTable";

export class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      playerStats: null
    };
    this.worker = null;
  }

  componentDidUpdate(previousProps) {
    const {
      team,
      teamSize,
      pointCount,
      opponentScoreRate,
      opponentDropRate,
      teamBlockRate,
      multiMode,
      iterationCount
    } = this.props;
    if (
      previousProps.team.length !== team.length ||
      opponentScoreRate !== previousProps.opponentScoreRate ||
      opponentDropRate !== previousProps.opponentDropRate ||
      teamBlockRate !== previousProps.teamBlockRate ||
      pointCount !== previousProps.pointCount ||
      multiMode !== previousProps.multiMode ||
      iterationCount !== previousProps.iterationCount
    ) {
      if (team.length === teamSize) {
        console.log("Running simulation...");
        this.runSimulation({
          team,
          pointCount,
          opponentScoreRate,
          opponentDropRate,
          teamBlockRate,
          multiMode,
          iterationCount
        });
      } else {
        if (this.worker != null) {
          this.worker.terminate();
          this.worker = null;
        }
        if (this.state.result !== null) {
          this.setState({ result: null });
        }
      }
    }
  }

  runSimulation = configuration => {
    if (this.worker != null) {
      this.worker.terminate();
    }
    this.setState({ result: null, error: null });
    this.worker = new SimulationWorker();
    this.worker.onmessage = event => {
      this.setState({ result: event.data });
      this.worker = null;
    };
    this.worker.onerror = error => {
      this.setState({ error });
      this.worker = null;
    };
    this.worker.postMessage(configuration);
  };

  render() {
    const { team, teamSize, multiMode } = this.props;
    if (team.length !== teamSize) {
      return <p>Player(s) needed: {teamSize - team.length}</p>;
    }

    const { error, result } = this.state;
    return (
      <div className="result">
        {error != null ? (
          <p>Error: {error.message}</p>
        ) : result == null ? (
          <p>Calculating...</p>
        ) : (
          <div>
            {multiMode ? (
              <>
                <p>
                  Simulated {result.iterationCount} iterations of{" "}
                  {result.pointCount} points in {result.elapsedMs}ms
                </p>
                <MultiResultTable playerStats={result.playerStats} />
              </>
            ) : (
              <>
                <p>
                  Simulated {result.pointCount} points in {result.elapsedMs}ms
                </p>
                <ResultTable playerStats={result.playerStats} />
              </>
            )}
          </div>
        )}
      </div>
    );
  }
}
