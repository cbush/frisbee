import React from "react";
import SimulationWorker from "../simulation.worker";

export class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      result: null
    };
    this.worker = null;
  }

  componentDidUpdate(previousProps) {
    const { team, teamSize } = this.props;
    if (previousProps.team.length !== team.length) {
      if (team.length === teamSize) {
        console.log("Running simulation...");
        this.runSimulation(team);
      } else if (this.worker != null) {
        this.worker.terminate();
        this.worker = null;
      }
    }
  }

  runSimulation = team => {
    this.worker = new SimulationWorker();
    this.worker.onmessage = event => {
      const { result, elapsedMs } = event.data;
      this.setState({ result, elapsedMs });
      this.worker = null;
    };
    this.worker.onerror = error => {
      this.setState({ error });
      this.worker = null;
    };
    this.worker.postMessage({ team });
  };

  render() {
    const { team, teamSize } = this.props;
    if (team.length !== teamSize) {
      return <p>Player(s) needed: {teamSize - team.length}</p>;
    }

    const { error, result, elapsedMs } = this.state;
    return (
      <div className="result">
        {error != null ? (
          <p>Error: {error.message}</p>
        ) : result == null ? (
          <p>Calculating...</p>
        ) : (
          <p>
            Results: {result} in {elapsedMs}ms
          </p>
        )}
      </div>
    );
  }
}
