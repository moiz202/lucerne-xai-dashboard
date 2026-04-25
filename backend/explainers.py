# backend/explainers.py
import numpy as np
import pandas as pd
import shap
from lime.lime_tabular import LimeTabularExplainer


class Explainers:
    def __init__(self, model, X_train: pd.DataFrame, feature_names):
        self.model = model
        self.X_train = X_train
        self.feature_names = feature_names

        try:
            self.shap_explainer = shap.TreeExplainer(self.model)
        except Exception:
            bg = shap.sample(self.X_train, min(50, len(self.X_train)))
            self.shap_explainer = shap.KernelExplainer(
                self.model.predict_proba,
                bg.values
            )

        self.lime_explainer = LimeTabularExplainer(
            training_data=self.X_train.values,
            feature_names=self.feature_names,
            class_names=["malignant", "benign"],
            mode="classification"
        )

    def shap_explain(self, instance: pd.Series):
        shap_values = self.shap_explainer.shap_values(
            instance.values.reshape(1, -1)
        )

        if isinstance(shap_values, list):
            out = {}
            expected = getattr(self.shap_explainer, "expected_value", None)

            for i, vals in enumerate(shap_values):
                base = None
                if expected is not None:
                    try:
                        base = float(expected[i])
                    except Exception:
                        try:
                            base = float(expected)
                        except Exception:
                            base = None

                out[f"class_{i}"] = {
                    "values": vals[0].tolist(),
                    "base_value": base
                }

            return out

        expected = getattr(self.shap_explainer, "expected_value", None)
        base = float(np.mean(expected)) if expected is not None else None

        return {
            "class_0": {
                "values": shap_values[0].tolist(),
                "base_value": base
            }
        }

    def lime_explain(self, instance: pd.Series, num_features=10):
        exp = self.lime_explainer.explain_instance(
            instance.values,
            self.model.predict_proba,
            num_features=num_features
        )

        pred_proba = self.model.predict_proba(
            instance.values.reshape(1, -1)
        )[0]

        pred_label = int(pred_proba.argmax())

        feature_list = exp.as_list()

        return {
            "predicted_class": pred_label,
            "feature_contributions": [
                {
                    "feature": feature,
                    "weight": float(weight)
                }
                for feature, weight in feature_list
            ]
        }