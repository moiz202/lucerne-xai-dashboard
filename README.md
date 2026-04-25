# XAI Dashboard (LIME + SHAP) — React + Flask

This repository implements a minimal, production-like Explainable AI dashboard that shows why a trained model made a decision.
It includes:
- Flask backend that trains/loads a `RandomForestClassifier` on the `sklearn` breast cancer dataset and exposes endpoints:
  - `POST /api/predict` → prediction + probabilities
  - `POST /api/explain` → SHAP and LIME explanations for a single instance
- React frontend that lets users enter features, request a prediction, and view interactive visual explanations.

See backend/ and frontend/ for full source files. Run instructions are in backend/README_RUN.txt and frontend/README_RUN.txt
