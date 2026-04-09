import numpy as np
import joblib
import os

FEATURES_DIR   = "backend/dataset/features"
X_PATH         = os.path.join(FEATURES_DIR, "X.npy")
Y_PATH         = os.path.join(FEATURES_DIR, "y.npy")
LE_PATH        = os.path.join(FEATURES_DIR, "label_encoder.pkl")

def cleanup_dataset():
    print("[INFO] Loading dataset features...")
    X = np.load(X_PATH)
    y = np.load(Y_PATH)
    le = joblib.load(LE_PATH)
    
    print(f"[OK] Initial shape: X={X.shape}, y={y.shape}")
    print(f"[INFO] Classes: {le.classes_}")
    
    # 1. Identify "PlantVillage" noise class
    if "PlantVillage" not in le.classes_:
        print("[SKIP] 'PlantVillage' class not found in encoder. Nothing to clean.")
        return
        
    pv_idx = np.where(le.classes_ == "PlantVillage")[0][0]
    pv_mask = (y == pv_idx)
    num_to_remove = np.sum(pv_mask)
    
    print(f"[INFO] Found {num_to_remove} samples in 'PlantVillage' noise class.")
    
    # 2. Filter dataset
    X_clean = X[~pv_mask]
    y_raw_clean = y[~pv_mask]
    
    # 3. Handle label mapping shift
    # Since we removed a class, we need to map the raw string labels back 
    # and re-encode to avoid holes in the index sequence.
    string_labels = [le.classes_[idx] for idx in y_raw_clean]
    
    from sklearn.preprocessing import LabelEncoder
    le_new = LabelEncoder()
    y_new = le_new.fit_transform(string_labels)
    
    print(f"[OK] Cleaned shape: X={X_clean.shape}, y={y_new.shape}")
    print(f"[INFO] New classes count: {len(le_new.classes_)}")
    
    # 4. Save results
    np.save(X_PATH, X_clean)
    np.save(Y_PATH, y_new)
    joblib.dump(le_new, LE_PATH)
    
    # Also update samples for testing
    n_samp = min(200, len(X_clean))
    np.save(os.path.join(FEATURES_DIR, "X_sample.npy"), X_clean[:n_samp])
    np.save(os.path.join(FEATURES_DIR, "y_sample.npy"), y_new[:n_samp])
    
    print("[SUCCESS] Dataset cleaned and re-saved.")

if __name__ == "__main__":
    cleanup_dataset()
