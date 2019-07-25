import React from "react";
import csv from "csvtojson";

export const withPlayers = Component => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        players: []
      };
    }

    componentDidMount() {
      return this.fetchPlayers().then(players => this.setState({ players }));
    }

    fetchPlayers = async () => {
      const response = await fetch("./players.csv");
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      const readResult = await reader.read();
      const text = await decoder.decode(readResult.value);
      return csv({ checkType: true }).fromString(text);
    };

    render() {
      return <Component {...this.state} />;
    }
  };
};
