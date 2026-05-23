import xgboost as xgb
import pandas as pd
import numpy as np

class StakeholderRiskModel:
    def __init__(self):
        # Initialize a basic XGBoost Classifier for tabular data predictions
        self.model = xgb.XGBClassifier(
            max_depth=3,
            learning_rate=0.1,
            n_estimators=100,
            use_label_encoder=False,
            eval_metric='logloss'
        )
        self._is_trained = False

    def train_dummy_model(self):
        """Trains on sample stakeholder data for hackathon demonstration."""
        # Features: [Sentiment_Score, Response_Time_Days, Interaction_Frequency]
        X = pd.DataFrame({
            'sentiment': [0.1, 0.9, 0.2, 0.8, 0.4, 0.7],
            'response_time': [5, 1, 4, 1, 3, 2],
            'frequency': [1, 10, 2, 8, 4, 6]
        })
        # Target: 1 (High Risk of Churn), 0 (Low Risk)
        y = np.array([1, 0, 1, 0, 1, 0])
        
        self.model.fit(X, y)
        self._is_trained = True
        return "Model trained successfully."

    def predict_risk(self, sentiment: float, response_time: int, frequency: int) -> float:
        """Predicts the probability of stakeholder churn."""
        if not self._is_trained:
            self.train_dummy_model()
            
        features = pd.DataFrame({
            'sentiment': [sentiment],
            'response_time': [response_time],
            'frequency': [frequency]
        })
        
        # Return probability of class 1 (High Risk)
        probability = self.model.predict_proba(features)[0][1]
        return float(probability)

# Initialize the service
risk_predictor = StakeholderRiskModel()