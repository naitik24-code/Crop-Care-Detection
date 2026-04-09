import os
import sys
import cv2
import numpy as np
import joblib

# Add backend to path for imports
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BACKEND_DIR)

try:
    from model.feature_extractor import extract_features
    from utils.preprocessing import process_and_segment
except ImportError as e:
    print(f"[ERROR] Import failed: {e}")
    sys.exit(1)

MODEL_PATH = os.path.join(BACKEND_DIR, "model", "lightgbm_model.pkl")
LE_PATH    = os.path.join(BACKEND_DIR, "dataset", "features", "label_encoder.pkl")

def predict_image(image_path):
    # 1. Load Model and Encoder
    if not os.path.exists(MODEL_PATH) or not os.path.exists(LE_PATH):
        print("[ERROR] Model or Label Encoder not found. Please wait for training to complete.")
        return

    print(f"[INFO] Loading model and label encoder...")
    model = joblib.load(MODEL_PATH)
    le = joblib.load(LE_PATH)

    # 2. Load and Preprocess Image
    print(f"[INFO] Processing image: {image_path}")
    img_bgr = cv2.imread(image_path)
    if img_bgr is None:
        print(f"[ERROR] Could not read image at {image_path}")
        return

    # Use same pipeline as create_dataset
    seg = process_and_segment(img_bgr, segment=True)
    if seg is None:
        print("[ERROR] Segmentation failed.")
        return

    # 3. Extract Features
    print("[INFO] Extracting hybrid features...")
    # extract_features handle L2 normalisation inside
    features = extract_features(seg) 
    
    if features is None:
        print("[ERROR] Feature extraction failed.")
        return

    # 4. Predict
    print("[INFO] Running inference...")
    features_batch = features.reshape(1, -1)
    
    # Get probabilities
    probs = model.predict_proba(features_batch)[0]
    pred_idx = np.argmax(probs)
    confidence = probs[pred_idx]
    
    label = le.inverse_transform([pred_idx])[0]
    
    print("\n" + "="*50)
    print(f"  HYBRID ENGINE PREDICTION")
    print("="*50)
    print(f"  Target Image : {os.path.basename(image_path)}")
    print(f"  Predicted    : {label}")
    print(f"  Confidence   : {confidence*100:.2f}%")
    print("="*50)
    
    # Show top 3 suggestions
    top_indices = np.argsort(probs)[::-1][:3]
    print("\n  Top 3 Candidates:")
    for i in top_indices:
        l = le.inverse_transform([i])[0]
        c = probs[i]
        print(f"  - {l:<35} {c*100:>6.2f}%")
    print("="*50 + "\n")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("\n[USAGE] py -3.13 backend/manual_predict.py <path_to_image>")
        
        # Try to find a sample image to show as example
        dataset_dir = os.path.join(BACKEND_DIR, "dataset", "PlantVillage")
        if os.path.exists(dataset_dir):
            for root, _, files in os.walk(dataset_dir):
                for f in files:
                    if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                        print(f"Example: py -3.13 backend/manual_predict.py \"{os.path.join(root, f)}\"")
                        sys.exit(1)
        sys.exit(1)
    
    predict_image(sys.argv[1])
