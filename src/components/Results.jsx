import React from "react";

export class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      result: null
    };
  }

  componentDidUpdate(previousProps) {
    const { team, teamSize } = this.props;
    if (previousProps.team.length !== team.length && team.length === teamSize) {
      console.log("Running simulation...");
      this.runSimulation(team);
    }
  }

  runSimulation = team => {
    this.worker = new Worker("./simulationWorker.js");
    this.worker.addEventListener("message", function(e) {
      console.log("Message from Worker: " + e.data);
    });
    this.worker.postMessage(team);
  };

  render() {
    const { team, teamSize } = this.props;
    if (team.length !== teamSize) {
      return <p>Player(s) needed: {teamSize - team.length}</p>;
    }

    const { error, result } = this.state;
    return (
      <div className="result">
        {error !== null ? (
          <p>Error: {error.message}</p>
        ) : result === null ? (
          <p>Calculating...</p>
        ) : (
          <p>Results: here</p>
        )}
      </div>
    );
  }
}
