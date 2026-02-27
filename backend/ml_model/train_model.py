"""
ML Model Training Script
Trains a Logistic Regression model to classify skill match levels
"""

import os
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix
import joblib
from pathlib import Path


def generate_training_data():
    """
    Generate synthetic training data for skill match classification
    
    Match levels:
    - High Match (2): 70-100% match
    - Medium Match (1): 40-69% match
    - Low Match (0): 0-39% match
    
    Returns:
        Tuple of (X, y) where X is match percentages and y is labels
    """
    np.random.seed(42)
    
    # Generate training samples
    n_samples = 1000
    
    # Generate match percentages with some noise
    X = []
    y = []
    
    for _ in range(n_samples):
        # Randomly choose a category
        category = np.random.choice([0, 1, 2], p=[0.3, 0.35, 0.35])
        
        if category == 0:  # Low Match
            percentage = np.random.uniform(0, 39)
        elif category == 1:  # Medium Match
            percentage = np.random.uniform(40, 69)
        else:  # High Match
            percentage = np.random.uniform(70, 100)
        
        # Add some noise/overlap at boundaries
        if category == 0 and percentage > 35:
            percentage = np.random.uniform(0, 35)
        elif category == 2 and percentage < 75:
            percentage = np.random.uniform(75, 100)
        
        X.append([percentage])
        y.append(category)
    
    return np.array(X), np.array(y)


def train_model():
    """
    Train the logistic regression model for skill match classification
    
    Returns:
        Trained model
    """
    print("Generating training data...")
    X, y = generate_training_data()
    
    print(f"Dataset shape: {X.shape}")
    print(f"Class distribution:")
    for i, label in enumerate(['Low Match', 'Medium Match', 'High Match']):
        count = np.sum(y == i)
        print(f"  {label}: {count} samples ({count/len(y)*100:.1f}%)")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"\nTraining set: {len(X_train)} samples")
    print(f"Test set: {len(X_test)} samples")
    
    # Create and train model
    print("\nTraining Logistic Regression model...")
    model = LogisticRegression(
        multi_class='multinomial',
        solver='lbfgs',
        max_iter=1000,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate model
    print("\nModel Evaluation:")
    print("-" * 50)
    
    # Training accuracy
    train_accuracy = model.score(X_train, y_train)
    print(f"Training Accuracy: {train_accuracy:.4f}")
    
    # Test accuracy
    test_accuracy = model.score(X_test, y_test)
    print(f"Test Accuracy: {test_accuracy:.4f}")
    
    # Cross-validation
    cv_scores = cross_val_score(model, X, y, cv=5)
    print(f"Cross-validation scores: {cv_scores}")
    print(f"Mean CV Score: {cv_scores.mean():.4f} (+/- {cv_scores.std()*2:.4f})")
    
    # Detailed classification report
    y_pred = model.predict(X_test)
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Low Match', 'Medium Match', 'High Match']))
    
    # Confusion matrix
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    return model


def save_model(model, model_dir=None):
    """
    Save the trained model to disk
    
    Args:
        model: Trained sklearn model
        model_dir: Directory to save model (default: ml_model directory)
    """
    if model_dir is None:
        model_dir = Path(__file__).parent
    
    model_path = os.path.join(model_dir, 'skill_match_model.joblib')
    joblib.dump(model, model_path)
    print(f"\nModel saved to: {model_path}")
    
    return model_path


def load_model(model_dir=None):
    """
    Load the trained model from disk
    
    Args:
        model_dir: Directory containing the model
        
    Returns:
        Loaded model
    """
    if model_dir is None:
        model_dir = Path(__file__).parent
    
    model_path = os.path.join(model_dir, 'skill_match_model.joblib')
    
    if os.path.exists(model_path):
        return joblib.load(model_path)
    else:
        print("Model not found. Training new model...")
        model = train_model()
        save_model(model, model_dir)
        return model


def predict_match_level(model, match_percentage):
    """
    Predict match level from match percentage
    
    Args:
        model: Trained model
        match_percentage: Match percentage (0-100)
        
    Returns:
        Tuple of (predicted_label, probability_scores)
    """
    # Reshape for single prediction
    X = np.array([[match_percentage]])
    
    # Get prediction
    prediction = model.predict(X)[0]
    
    # Get probability scores
    probabilities = model.predict_proba(X)[0]
    
    # Map prediction to label
    labels = ['Low Match', 'Medium Match', 'High Match']
    predicted_label = labels[prediction]
    
    # Create probability dict
    prob_dict = {
        'low_match': round(probabilities[0] * 100, 2),
        'medium_match': round(probabilities[1] * 100, 2),
        'high_match': round(probabilities[2] * 100, 2)
    }
    
    return predicted_label, prob_dict


# Main execution
if __name__ == '__main__':
    print("=" * 60)
    print("Skill Match Classification Model Training")
    print("=" * 60)
    
    # Train model
    model = train_model()
    
    # Save model
    model_path = save_model(model)
    
    # Test predictions
    print("\n" + "=" * 60)
    print("Testing Predictions")
    print("=" * 60)
    
    test_percentages = [15, 25, 45, 55, 75, 85, 95]
    for pct in test_percentages:
        label, probs = predict_match_level(model, pct)
        print(f"\nMatch Percentage: {pct}%")
        print(f"Predicted: {label}")
        print(f"Probabilities: {probs}")
    
    print("\n" + "=" * 60)
    print("Model training complete!")
    print("=" * 60)