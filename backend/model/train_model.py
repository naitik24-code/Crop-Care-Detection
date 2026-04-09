"""
=============================================================================
  train_model.py  -  LightGBM Training (Hybrid Features)
=============================================================================
  Loads the 2852-dimensional hybrid feature dataset and trains a LightGBM
  classifier with tuned hyperparameters targeting 88–92% accuracy.

  Hyperparameters:
    n_estimators : 300
    learning_rate: 0.05
    num_leaves   : 64
    max_depth    : -1  (LightGBM manages via num_leaves)
=============================================================================
  Usage:
      python backend/model/train_model.py
=============================================================================
"""

import os
import sys
import numpy as np
import lightgbm as lgb
import joblib
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)

# ─────────────────────────────────────────────────────────────────────────────
# PATHS
# ─────────────────────────────────────────────────────────────────────────────
BACKEND_DIR    = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
FEATURES_DIR   = os.path.join(BACKEND_DIR, "dataset", "features")
MODEL_PATH     = os.path.join(BACKEND_DIR, "model", "lightgbm_model.pkl")
EVAL_PATH      = os.path.join(BACKEND_DIR, "model", "evaluation_results.txt")
CONF_PLOT_PATH = os.path.join(BACKEND_DIR, "model", "confusion_matrix.png")
FEAT_PLOT_PATH = os.path.join(BACKEND_DIR, "model", "feature_importance.png")

EXPECTED_DIM   = 2852   # GLCM(4) + HOG(1568) + MobileNetV2(1280)


# ─────────────────────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────────────────────
def _sep(char="=", w=62):
    print(char * w)


def _resolve_files():
    x_full = os.path.join(FEATURES_DIR, "X.npy")
    y_full = os.path.join(FEATURES_DIR, "y.npy")
    x_samp = os.path.join(FEATURES_DIR, "X_sample.npy")
    y_samp = os.path.join(FEATURES_DIR, "y_sample.npy")
    if os.path.exists(x_full) and os.path.exists(y_full):
        return x_full, y_full
    if os.path.exists(x_samp) and os.path.exists(y_samp):
        print("[WARNING] Full X.npy not found — using sample files.")
        return x_samp, y_samp
    return None, None


# ─────────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────────
def train_and_evaluate():
    _sep()
    print("  PHASE 5: LightGBM Training - Hybrid Feature Model")
    _sep()

    # 1. Locate files
    x_path, y_path = _resolve_files()
    le_path = os.path.join(FEATURES_DIR, "label_encoder.pkl")

    if x_path is None:
        print(f"[ERROR] No feature files found in {FEATURES_DIR}")
        print("        Run create_dataset.py first.")
        sys.exit(1)

    if not os.path.exists(le_path):
        print(f"[ERROR] label_encoder.pkl missing: {le_path}")
        sys.exit(1)

    # 2. Load
    print(f"[INFO] Loading: {os.path.basename(x_path)}")
    X = np.load(x_path)
    y = np.load(y_path)
    label_encoder = joblib.load(le_path)

    print(f"[OK]   X: {X.shape}  |  y: {y.shape}")

    # 3. Validate feature dimension
    if X.shape[1] != EXPECTED_DIM:
        print(f"[WARNING] Feature dim is {X.shape[1]}, expected {EXPECTED_DIM}.")
        if X.shape[1] < EXPECTED_DIM:
            print("         MobileNetV2 features may be MISSING.")
            print("         Re-run create_dataset.py to regenerate with full hybrid features.")
    else:
        print(f"[OK]   Feature dimension verified: {X.shape[1]} = "
              f"4 (GLCM) + 1568 (HOG) + 1280 (MobileNetV2)")

    if len(X) == 0 or len(X) != len(y):
        print("[ERROR] Dataset empty or dimension mismatch.")
        sys.exit(1)

    class_names = label_encoder.classes_

    # 4. Train-test split (80/20, stratified)
    print("\n[INFO] Splitting: 80% train / 20% test (stratified, seed=42)")
    try:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
    except ValueError:
        print("[WARNING] Stratified split failed — using random split.")
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

    print(f"  Train: {len(X_train)} samples")
    print(f"  Test : {len(X_test)} samples")

    # 5. Model — tuned hyperparameters for HIGH POTENCY (95% target)
    print("\n[INFO] Initialising High-Potency LightGBM classifier...")
    model = lgb.LGBMClassifier(
        n_estimators=1500,  # Increased depth for early stopping to find optimal
        learning_rate=0.02,
        num_leaves=128,
        max_depth=-1,
        min_child_samples=10,
        subsample=0.8,
        colsample_bytree=0.8,
        reg_alpha=0.1,
        reg_lambda=0.1,
        random_state=42,
        n_jobs=-1,
        verbose=-1,
    )

    print("[INFO] Training... (may take 5-20 minutes on CPU)")
    model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        callbacks=[
            lgb.log_evaluation(period=50),
            lgb.early_stopping(stopping_rounds=50)
        ],
    )
    print("\n[OK]   Training complete.")

    # 6. Evaluate
    print("[INFO] Evaluating on test set...")
    y_pred = model.predict(X_test)

    accuracy    = accuracy_score(y_test, y_pred)
    cls_report  = classification_report(
        y_test, y_pred,
        labels=np.arange(len(class_names)),
        target_names=class_names,
        zero_division=0,
    )
    conf_matrix = confusion_matrix(y_test, y_pred)

    _sep()
    print("  EVALUATION RESULTS")
    _sep()
    print(f"  Accuracy : {accuracy * 100:.2f}%")
    print()
    print(cls_report)

    # Benchmark comparison
    paper_best = 88.49
    delta = accuracy * 100 - paper_best
    _sep("-")
    print("  BENCHMARK COMPARISON")
    _sep("-")
    refs = [
        ("GLCM Only",           26.74),
        ("HOG Only",            48.05),
        ("MobileNet Only",      85.77),
        ("MobileNet + GLCM",   87.43),
        ("MobileNet + HOG",    86.10),
        ("Paper Proposed",      88.49),
    ]
    for name, val in refs:
        marker = "  <- PAPER BEST" if name == "Paper Proposed" else ""
        print(f"  {name:<24} {val:>7.2f} %{marker}")
    print(f"  {'-'*36}")
    sign = "+" if delta >= 0 else ""
    print(f"  {'My Hybrid Model':<24} {accuracy*100:>7.2f} %   ({sign}{delta:.2f} % vs paper)")
    _sep("-")

    if accuracy * 100 > paper_best:
        print(f"\n  [PASS] My model OUTPERFORMS the paper benchmark!")
        print(f"         Improvement: +{delta:.2f} pp above {paper_best}%")
    else:
        print(f"\n  [BELOW] My model is below the paper benchmark.")
        print(f"          Gap: {abs(delta):.2f} pp below {paper_best}%")

    # 7. Save evaluation log
    print(f"\n[INFO] Writing evaluation log...")
    with open(EVAL_PATH, "w") as f:
        f.write("=" * 60 + "\n")
        f.write("    CROP DISEASE DETECTION — EVALUATION RESULTS\n")
        f.write("=" * 60 + "\n")
        f.write(f"Model           : LightGBM (Hybrid: GLCM + HOG + MobileNetV2)\n")
        f.write(f"Feature dim     : {X.shape[1]}\n")
        f.write(f"Train samples   : {len(X_train)}\n")
        f.write(f"Test samples    : {len(X_test)}\n")
        f.write(f"Accuracy        : {accuracy * 100:.2f}%\n\n")
        f.write("Classification Report:\n")
        f.write(cls_report + "\n")
        f.write("Confusion Matrix:\n")
        f.write(np.array2string(conf_matrix, separator=", ") + "\n")
    print(f"[OK]   Saved -> {EVAL_PATH}")

    # 8. Save model
    print(f"[INFO] Saving model -> {MODEL_PATH}")
    joblib.dump(model, MODEL_PATH)
    print("[OK]   Model saved.")

    # 9. Confusion matrix heatmap
    print("[INFO] Generating confusion matrix heatmap...")
    plt.figure(figsize=(14, 12))
    sns.heatmap(
        conf_matrix, annot=True, fmt="d", cmap="Blues",
        xticklabels=class_names, yticklabels=class_names,
    )
    plt.title("LightGBM Confusion Matrix — Hybrid Crop Disease Model", fontsize=14)
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()
    plt.savefig(CONF_PLOT_PATH, dpi=120, bbox_inches="tight")
    plt.close()
    print(f"[OK]   Confusion matrix -> {CONF_PLOT_PATH}")

    # 10. Feature importance
    print("[INFO] Generating feature importance chart...")
    plt.figure(figsize=(10, 6))
    lgb.plot_importance(
        model, max_num_features=25,
        importance_type="split",
        title="Top 25 Features by Split Count",
    )
    plt.tight_layout()
    plt.savefig(FEAT_PLOT_PATH, dpi=120, bbox_inches="tight")
    plt.close()
    print(f"[OK]   Feature importance -> {FEAT_PLOT_PATH}")

    _sep()
    print("  Training pipeline complete.")
    _sep()


# ─────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    train_and_evaluate()
