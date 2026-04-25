# backend/model_store.py
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
import joblib
import pandas as pd

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'saved_model.joblib')

def train_and_save_model():
    """Train a RandomForest on sklearn breast cancer dataset and save it with joblib.
    Also return training data and metadata needed by explainers.
    """
    data = load_breast_cancer()
    X = pd.DataFrame(data.data, columns=data.feature_names)
    y = pd.Series(data.target)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    metadata = {
        'feature_names': list(data.feature_names),
        'target_names': list(data.target_names),
    }

    joblib.dump({'model': model, 'metadata': metadata, 'X_train': X_train, 'y_train': y_train}, MODEL_PATH)
    return model, X_train, y_train, metadata

def load_model_or_train():
    if os.path.exists(MODEL_PATH):
        saved = joblib.load(MODEL_PATH)
        model = saved['model']
        metadata = saved['metadata']
        X_train = saved['X_train']
        y_train = saved['y_train']
        return model, X_train, y_train, metadata
    else:
        return train_and_save_model()
