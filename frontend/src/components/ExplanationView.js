import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  ReferenceLine
} from "recharts";

export default function ExplanationView({ result, loading }) {
  if (loading) {
    return (
      <div className="results-area">
        <div className="panel prediction-panel loading-panel">
          <h2>2. Prediction Result</h2>
          <div className="ai-badge">AI Processing</div>

          <div className="loader-container">
            <div className="spinner"></div>
            <p className="loading-text">
              Generating prediction and explanations<span className="dots"></span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="results-area">
        <div className="panel prediction-panel">
          <h2>2. Prediction Result</h2>
          <p>Load a sample patient and run prediction to view results.</p>
        </div>
      </div>
    );
  }

  const prediction = result.prediction?.prediction;
  const probabilities = result.prediction?.probabilities || [];

  const predictedText = prediction === 0 ? "Malignant" : "Benign";
  const isMalignant = predictedText === "Malignant";

  const confidence = probabilities[prediction]
    ? (probabilities[prediction] * 100).toFixed(0)
    : "0";

  const featureNames = [
    "mean radius", "mean texture", "mean perimeter", "mean area",
    "mean smoothness", "mean compactness", "mean concavity",
    "mean concave points", "mean symmetry", "mean fractal dimension",
    "radius error", "texture error", "perimeter error", "area error",
    "smoothness error", "compactness error", "concavity error",
    "concave points error", "symmetry error", "fractal dimension error",
    "worst radius", "worst texture", "worst perimeter", "worst area",
    "worst smoothness", "worst compactness", "worst concavity",
    "worst concave points", "worst symmetry", "worst fractal dimension"
  ];

  const toNumber = (value) => {
    if (Array.isArray(value)) return toNumber(value[prediction] ?? value[0]);
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  const formatInfluence = (value) => {
    const direction = value >= 0 ? "towards malignant" : "towards benign";
    return `${Math.abs(value * 100).toFixed(2)}% influence ${direction}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;

      return (
        <div className="custom-tooltip">
          <strong>{label}</strong>
          <p>{formatInfluence(value)}</p>
        </div>
      );
    }

    return null;
  };

  const shapValues = result.shap?.shap?.class_0?.values || [];

  let shapData = shapValues.map((v, i) => ({
    name: featureNames[i],
    value: toNumber(v),
    absValue: Math.abs(toNumber(v))
  }));

  shapData.sort((a, b) => b.absValue - a.absValue);
  shapData = shapData.slice(0, 10);

  const topFeatures = shapData.slice(0, 5);

  const limeContributions =
    result.lime?.lime?.feature_contributions ||
    result.lime?.feature_contributions ||
    [];

  const limeData = limeContributions
    .map((item) => ({
      name: item.feature,
      value: toNumber(item.weight),
      absValue: Math.abs(toNumber(item.weight))
    }))
    .sort((a, b) => b.absValue - a.absValue)
    .slice(0, 10);

  return (
    <div className="results-area">
      <div className="panel prediction-panel">
        <h2>2. Prediction Result</h2>

        <div className={isMalignant ? "risk-box danger-box" : "risk-box safe-box"}>
          <div className="risk-icon">{isMalignant ? "🎗" : "✓"}</div>

          <div>
            <p className="risk-status">
              {isMalignant ? "High Risk Detected" : "Low Risk Detected"}
            </p>

            <p className="prediction-line">
              Prediction: <strong>{predictedText}</strong>
            </p>

            <p className="confidence-label">Confidence Score</p>
            <h1>{confidence}%</h1>

            <div className="confidence-bar">
              <span style={{ width: `${confidence}%` }}></span>
            </div>
          </div>
        </div>

        <div className="metrics-box">
          <h3>Model Performance (Test Set)</h3>
          <div className="metrics-grid">
            <div><span>Accuracy</span><strong>96.49%</strong></div>
            <div><span>Precision</span><strong>95.74%</strong></div>
            <div><span>Recall</span><strong>96.49%</strong></div>
            <div><span>F1-Score</span><strong>96.11%</strong></div>
          </div>
        </div>
      </div>

      <div className="panel top-features-panel">
        <h2>3. Top SHAP Influencing Features</h2>
        <p>Features ranked by SHAP contribution</p>

        <div className="top-feature-list">
          {topFeatures.map((item, index) => (
            <div className="top-feature-row" key={item.name}>
              <span>{index + 1}</span>
              <p>{item.name}</p>
              <strong>
                {item.value >= 0 ? "↑" : "↓"} {(item.absValue * 100).toFixed(1)}%
              </strong>
            </div>
          ))}
        </div>

        <div className="info-box">
          ⓘ These features are ranked using SHAP values. Higher percentages mean stronger influence on the model’s decision.
        </div>

        <div className="comparison-box">
          <strong>SHAP vs LIME:</strong> SHAP ranks the strongest overall feature impacts, while LIME explains why this specific prediction was made locally.
        </div>
      </div>

      <div className="panel shap-panel">
        <h2>4. Global Feature Importance (SHAP)</h2>
        <p>
          Shows which features had the strongest influence on the model decision.
          Red bars push toward malignant, blue bars push toward benign.
        </p>

        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={shapData} layout="vertical" margin={{ left: 20, right: 35 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d8e5f2" />
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
            />
            <YAxis dataKey="name" type="category" width={175} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={0} stroke="#64748b" />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {shapData.map((entry, index) => (
                <Cell key={index} fill={entry.value >= 0 ? "#e11d48" : "#2563eb"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="panel lime-panel">
        <h2>5. Local Explanation (LIME)</h2>
        <p>
          Explains why this specific prediction was made.
          Green bars push toward malignant, red bars push toward benign.
        </p>

        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={limeData} layout="vertical" margin={{ left: 10, right: 35 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d8e5f2" />
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
            />
            <YAxis dataKey="name" type="category" width={230} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={0} stroke="#64748b" />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {limeData.map((entry, index) => (
                <Cell key={index} fill={entry.value >= 0 ? "#10b981" : "#ef4444"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="lime-help">
          Positive values increase likelihood of malignancy. Negative values indicate features associated with benign outcomes.
        </div>
      </div>

      <div className="panel insight-panel">
        <h2>6. Prediction Insight</h2>
        <p>
          The prediction is mainly influenced by tumour shape and size-related
          features. These characteristics are commonly associated with patterns
          used by the model to separate malignant and benign cases.
        </p>
      </div>
    </div>
  );
}