# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import traceback

from model_store import load_model_or_train
from explainers import Explainers

app = Flask(__name__)
CORS(app)

# Initialize model and explainers on startup
try:
    MODEL, X_TRAIN, Y_TRAIN, METADATA = load_model_or_train()
    FEATURE_NAMES = METADATA['feature_names']
    EXPLAINERS = Explainers(MODEL, X_TRAIN, FEATURE_NAMES)
except Exception as e:
    print('Error during model load/train:')
    traceback.print_exc()
    MODEL, X_TRAIN, Y_TRAIN, METADATA = None, None, None, {'feature_names': [], 'target_names': []}
    FEATURE_NAMES = METADATA['feature_names']
    EXPLAINERS = None

@app.route('/api/metadata', methods=['GET'])
def metadata():
    return jsonify({'feature_names': FEATURE_NAMES, 'target_names': METADATA.get('target_names', [])})

@app.route('/api/predict', methods=['POST'])
def predict():
    payload = request.get_json(force=True)
    features = payload.get('features')
    if isinstance(features, dict):
        x = [features.get(fn, 0.0) for fn in FEATURE_NAMES]
    elif isinstance(features, list):
        x = features
    else:
        return jsonify({'error': 'Invalid features format.'}), 400

    if MODEL is None:
        return jsonify({'error': 'Model not available on server.'}), 500

    try:
        arr = np.array(x, dtype=float).reshape(1, -1)
        proba = MODEL.predict_proba(arr)[0].tolist()
        pred = int(np.argmax(proba))
        return jsonify({'prediction': pred, 'probabilities': proba})
    except Exception as e:
        return jsonify({'error': 'Prediction error', 'details': str(e)}), 500

@app.route('/api/explain', methods=['POST'])
def explain():
    payload = request.get_json(force=True)
    features = payload.get('features')
    explainer_type = payload.get('method', 'shap')

    if isinstance(features, dict):
        x = [features.get(fn, 0.0) for fn in FEATURE_NAMES]
    elif isinstance(features, list):
        x = features
    else:
        return jsonify({'error': 'Invalid features format.'}), 400

    if EXPLAINERS is None:
        return jsonify({'error': 'Explainers not available on server.'}), 500

    instance = pd.Series(x, index=FEATURE_NAMES)

    try:
        if explainer_type.lower() == 'shap':
            shap_result = EXPLAINERS.shap_explain(instance)
            return jsonify({'method': 'shap', 'shap': shap_result})
        elif explainer_type.lower() == 'lime':
            lime_result = EXPLAINERS.lime_explain(instance)
            return jsonify({'method': 'lime', 'lime': lime_result})
        else:
            return jsonify({'error': 'Unknown method'}), 400
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': 'Explanation error', 'details': str(e)}), 500

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8000, debug=True)

