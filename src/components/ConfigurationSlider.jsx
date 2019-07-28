import React, { useState } from "react";
import Slider from "rc-slider";
export const ConfigurationSlider = ({
  label,
  defaultValue,
  setValue,
  min,
  max,
  step
}) => {
  const [displayValue, setDisplayValue] = useState(defaultValue);
  return (
    <div className="configurationSlider">
      <label>{label}</label>
      <Slider
        className="slider"
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={step}
        onChange={value => setDisplayValue(value)}
        onAfterChange={setValue}
      />
      <p>{displayValue}</p>
    </div>
  );
};
