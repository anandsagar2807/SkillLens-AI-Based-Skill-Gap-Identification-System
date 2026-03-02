"""
Setup script for Render deployment
Downloads NLTK data and trains the ML model
"""
import nltk
from ml_model.train_model import train_model, save_model

def setup():
    print("Downloading NLTK data...")
    nltk.download('punkt')
    nltk.download('punkt_tab')
    nltk.download('stopwords')
    print("NLTK data downloaded successfully!")
    
    print("\nTraining ML model...")
    model = train_model()
    save_model(model)
    print("ML model trained and saved successfully!")

if __name__ == "__main__":
    setup()