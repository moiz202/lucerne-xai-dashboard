import React, { useState, useEffect } from "react";

const sampleValues = {
  "mean radius": 17.99,
  "mean texture": 10.38,
  "mean perimeter": 122.8,
  "mean area": 1001.0,
  "mean smoothness": 0.1184,
  "mean compactness": 0.2776,
  "mean concavity": 0.3001,
  "mean concave points": 0.1471,
  "mean symmetry": 0.2419,
  "mean fractal dimension": 0.07871,
  "radius error": 1.095,
  "texture error": 0.9053,
  "perimeter error": 8.589,
  "area error": 153.4,
  "smoothness error": 0.006399,
  "compactness error": 0.04904,
  "concavity error": 0.05373,
  "concave points error": 0.01587,
  "symmetry error": 0.03003,
  "fractal dimension error": 0.006193,
  "worst radius": 25.38,
  "worst texture": 17.33,
  "worst perimeter": 184.6,
  "worst area": 2019.0,
  "worst smoothness": 0.1622,
  "worst compactness": 0.6656,
  "worst concavity": 0.7119,
  "worst concave points": 0.2654,
  "worst symmetry": 0.4601,
  "worst fractal dimension": 0.1189
};

export default function PredictionForm({ featureNames, onSubmit }) {
  const [values, setValues] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (featureNames) {
      const initial = {};
      featureNames.forEach((f) => (initial[f] = ""));
      setValues(initial);
    }
  }, [featureNames]);

  if (!featureNames) return <div>Loading feature list...</div>;

  const handleChange = (fn, v) => {
    setValues((prev) => ({ ...prev, [fn]: v }));
  };

  const loadSample = () => {
    setValues(sampleValues);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const numericValues = {};

    for (const k of featureNames) {
      if (values[k] === "" || values[k] === undefined) {
        setError("Fill all fields or press Load Sample.");
        return;
      }

      const num = parseFloat(values[k]);

      if (isNaN(num)) {
        setError("All values must be numbers.");
        return;
      }

      numericValues[k] = num;
    }

    setError("");
    onSubmit(numericValues);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <button type="button" onClick={loadSample}>
          Load Sample Patient
        </button>

        <button type="submit">
          Predict & Explain
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {featureNames.map((fn) => (
        <div key={fn}>
          <label>{fn}</label>
          <input
            type="number"
            value={values[fn] || ""}
            onChange={(e) => handleChange(fn, e.target.value)}
          />
        </div>
      ))}
    </form>
  );
}