import React, { useState } from "react";
import Slider from "rc-slider";
export const ConfigurationSlider = ({ label, defaultValue, setValue }) => {
  const [displayValue, setDisplayValue] = useState(defaultValue);
  return (
    <div className="configurationSlider">
      <label>{label}</label>
      <Slider
        className="slider"
        defaultValue={defaultValue}
        min={0}
        max={1}
        step={0.01}
        onChange={value => setDisplayValue(value)}
        onAfterChange={setValue}
      />
      <p>{displayValue}</p>
    </div>
  );
};
