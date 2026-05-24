class StakeholderRiskModel:
    def __init__(self):
        # Using a lightweight heuristic model instead of XGBoost for Vercel deployment
        self._is_trained = True

    def predict_risk(self, sentiment: float, response_time: int, frequency: int) -> float:
        """Predicts the probability of stakeholder churn using a mathematical heuristic."""
        # Base risk is inversely proportional to sentiment (High sentiment = Low risk)
        base_risk = 1.0 - sentiment
        
        # Longer response time increases risk (Penalty)
        time_penalty = (response_time - 2) * 0.1
        
        # Higher interaction frequency decreases risk (Bonus)
        freq_bonus = (frequency - 5) * 0.05
        
        # Calculate final probability
        probability = base_risk + time_penalty - freq_bonus
        
        # Ensure the probability stays strictly between 0.05 and 0.95
        return float(max(0.05, min(0.95, probability)))

# Initialize the service
risk_predictor = StakeholderRiskModel()