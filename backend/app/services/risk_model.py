import numpy as np

class StakeholderRiskModel:
    def __init__(self):
        """
        A lightweight Logistic Regression model implemented with NumPy.
        Provides robust predictions while staying within Vercel's size limits.
        """
        # Features: [Sentiment (0-1), Response_Time (days), Frequency (count)]
        self.weights = np.array([-2.5, 0.4, -0.6]) # Initial weights reflecting typical churn logic
        self.bias = 0.5
        self._is_trained = False

    def sigmoid(self, z):
        """Standard sigmoid activation function."""
        return 1 / (1 + np.exp(-np.clip(z, -250, 250)))

    def train_dummy_model(self):
        """
        Trains the model using Gradient Descent on sample stakeholder data.
        Demonstrates the model's ability to learn from data without scikit-learn.
        """
        # Training Data: [Sentiment, ResponseTime, Frequency]
        # High Risk (1): Low sentiment, high response time, low frequency
        # Low Risk (0): High sentiment, low response time, high frequency
        X = np.array([
            [0.1, 10, 1], [0.2, 8, 2], [0.4, 5, 3], # Likely Churn
            [0.9, 1, 10], [0.8, 2, 8], [0.7, 3, 6]  # Likely Loyal
        ])
        y = np.array([1, 1, 1, 0, 0, 0])

        # Hyperparameters
        lr = 0.1
        epochs = 500
        
        # Simple Gradient Descent
        for _ in range(epochs):
            z = np.dot(X, self.weights) + self.bias
            predictions = self.sigmoid(z)
            
            # Gradients
            dw = (1 / len(y)) * np.dot(X.T, (predictions - y))
            db = (1 / len(y)) * np.sum(predictions - y)
            
            # Update
            self.weights -= lr * dw
            self.bias -= lr * db

        self._is_trained = True
        return "Logistic Regression trained successfully."

    def predict_risk(self, sentiment: float, response_time: int, frequency: int) -> float:
        """
        Predicts the probability of stakeholder churn using the logistic function.
        """
        if not self._is_trained:
            self.train_dummy_model()
            
        x = np.array([sentiment, float(response_time), float(frequency)])
        z = np.dot(x, self.weights) + self.bias
        probability = self.sigmoid(z)
        
        return float(probability)

# Initialize the service
risk_predictor = StakeholderRiskModel()