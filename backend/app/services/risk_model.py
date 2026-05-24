import xgboost as xgb
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
        """Trains on sample stakeholder data using lightweight NumPy arrays."""
        # Features: [Sentiment_Score, Response_Time_Days, Interaction_Frequency]
        X = np.array([
            [0.1, 5, 1],
            [0.9, 1, 10],
            [0.2, 4, 2],
            [0.8, 1, 8],
            [0.4, 3, 4],
            [0.7, 2, 6]
        ])
        # Target: 1 (High Risk of Churn), 0 (Low Risk)
        y = np.array([1, 0, 1, 0, 1, 0])
        
        self.model.fit(X, y)
        self._is_trained = True
        return "Model trained successfully."

    def predict_risk(self, sentiment: float, response_time: int, frequency: int) -> float:
        """Predicts the probability of stakeholder churn."""
        if not self._is_trained:
            self.train_dummy_model()
            
        features = np.array([[sentiment, response_time, frequency]])
        
        # Return probability of class 1 (High Risk)
        probability = self.model.predict_proba(features)[0][1]
        return float(probability)

# Initialize the service
risk_predictor = StakeholderRiskModel()