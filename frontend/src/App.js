import React, { useState, useEffect } from "react";
import { fetchMetadata, predict, explain } from "./api";
import PredictionForm from "./components/PredictionForm";
import ExplanationView from "./components/ExplanationView";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [featureNames, setFeatureNames] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMetadata()
      .then((data) => setFeatureNames(data.feature_names))
      .catch((error) => console.error("Failed to load metadata:", error));
  }, []);

  const handleSubmit = async (features) => {
    try {
      setLoading(true);
      setResult(null);

      const prediction = await predict(features);
      const shap = await explain(features, "shap");
      const lime = await explain(features, "lime");

      setResult({ prediction, shap, lime });
    } catch (error) {
      console.error("Prediction/explanation failed:", error);
      alert("Something failed. Check backend terminal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">
          <div className="logo">♡</div>
          <div>
            <h2>LUCERNE</h2>
            <p>Explainable AI Dashboard</p>
          </div>
        </div>

        <div className="nav-links">
          <button className={page === "home" ? "nav-active" : ""} onClick={() => setPage("home")}>
            ⌂ Home
          </button>

          <button className={page === "dashboard" ? "nav-active" : ""} onClick={() => setPage("dashboard")}>
            ▥ Dashboard
          </button>

          <button className={page === "about" ? "nav-active" : ""} onClick={() => setPage("about")}>
            ⓘ About
          </button>
        </div>
      </nav>

      {page === "home" && (
        <main className="home-page">
          <div className="hero-icon">✚</div>

          <h1>LUCERNE</h1>
          <h3>EXPLAINABLE AI DASHBOARD</h3>

          <p className="hero-text">
            An interactive system for breast cancer prediction using{" "}
            <span>SHAP</span> and <span>LIME</span> to explain AI decisions.
          </p>

          <section className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon blue">⚕</div>
              <h4>Predict Tumor Type</h4>
              <p>Predict whether the tumour is benign or malignant with high accuracy.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon green">▥</div>
              <h4>Explain Predictions</h4>
              <p>Understand predictions using SHAP global and LIME local explanations.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon purple">♜</div>
              <h4>Transparency in Healthcare</h4>
              <p>Promote trust and transparency in AI-driven healthcare decisions.</p>
            </div>
          </section>

          <button className="next-btn" onClick={() => setPage("dashboard")}>
            Next Page →
          </button>

          <div className="notice">
            ⓘ This system is for decision support only and does not replace medical advice.
          </div>
        </main>
      )}

      {page === "dashboard" && (
        <main className="dashboard-page">
          <section className="dashboard-title">
            <h1>AI Prediction Dashboard</h1>
            <p>Understand and explain breast cancer predictions</p>
          </section>

          <section className="dashboard-layout">
            <div className="panel input-panel">
              <h2>1. Input Features</h2>
              <p>Enter patient data to make a prediction</p>

              <PredictionForm
                featureNames={featureNames}
                onSubmit={handleSubmit}
              />
            </div>

            <ExplanationView result={result} loading={loading} />
          </section>

          <div className="notice dashboard-notice">
            ⓘ This system is for decision support only and does not replace medical advice or professional judgement.
          </div>
        </main>
      )}

      {page === "about" && (
        <main className="about-page guidance-page">
          <section className="guidance-header">
            <h1>AI Interpretation & Clinical Guidance</h1>
            <p>
              This page explains how Lucerne should be interpreted, what the model output means,
              and how SHAP and LIME support safer AI-assisted healthcare decision-making.
            </p>
          </section>

          <section className="guidance-grid">
            <div className="guidance-card">
              <h3>1. AI Insight Summary</h3>
              <p>
                Lucerne uses tumour measurements to predict whether a case is more likely to be
                benign or malignant. The explanation tools highlight the features that had the
                strongest effect on the model’s decision.
              </p>
            </div>

            <div className="guidance-card">
              <h3>2. Key Risk Drivers</h3>
              <p>
                Features such as concave points, area, radius, perimeter and concavity may strongly
                influence the result because they describe tumour size, shape and irregularity.
              </p>
            </div>

            <div className="guidance-card">
              <h3>3. SHAP Explanation</h3>
              <p>
                SHAP shows how each feature contributes to the model output. It helps identify which
                variables pushed the prediction towards benign or malignant.
              </p>
            </div>

            <div className="guidance-card">
              <h3>4. LIME Explanation</h3>
              <p>
                LIME explains one individual prediction by showing the local feature conditions that
                influenced the result for that specific patient case.
              </p>
            </div>

            <div className="guidance-card">
              <h3>5. Clinical Guidance</h3>
              <p>
                If the model indicates a malignant result, the case should be reviewed by a qualified
                healthcare professional. Further evaluation may include imaging, biopsy, laboratory
                assessment or specialist consultation. Treatment decisions are made only after full
                clinical assessment.
              </p>
            </div>

            <div className="guidance-card">
              <h3>6. Benign Result Guidance</h3>
              <p>
                If the model suggests a benign result, this should still be interpreted with caution.
                Routine monitoring or follow-up may be recommended by a healthcare professional
                depending on clinical context.
              </p>
            </div>

            <div className="guidance-card">
              <h3>7. Confidence Explanation</h3>
              <p>
                A high confidence score means the model strongly supports its prediction. However,
                confidence is not the same as clinical certainty and should always be interpreted
                alongside professional judgement.
              </p>
            </div>

            <div className="guidance-card">
              <h3>8. System Limitations</h3>
              <p>
                Lucerne does not consider medical imaging, biopsy results, patient history, hormone
                receptor status or other clinical factors required for diagnosis and treatment
                planning.
              </p>
            </div>
          </section>

          <section className="guidance-warning">
            <h3>Ethical & Clinical Disclaimer</h3>
            <p>
              Lucerne is designed for educational and decision-support purposes only. It does not
              diagnose cancer, predict cancer stage, or prescribe treatment. Clinical decisions must
              always be made by qualified healthcare professionals.
            </p>
          </section>

          <div className="developer-signature">
            Developed by Moiaz Amir
            <br />
            University of Roehampton
          </div>
        </main>
      )}
    </div>
  );
}

export default App;