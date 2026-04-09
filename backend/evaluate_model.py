import os
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

# -----------------------------------------------------------------------------
# PATHS
# -----------------------------------------------------------------------------
MODEL_PATH = "backend/model/lightgbm_model.pkl"
X_PATH = "backend/dataset/features/X.npy"
Y_PATH = "backend/dataset/features/y.npy"
ENCODER_PATH = "backend/dataset/features/label_encoder.pkl"
OUTPUT_DIR = "backend/model"

# -----------------------------------------------------------------------------
# HELPERS
# -----------------------------------------------------------------------------
def load_labels():
    if os.path.exists(ENCODER_PATH):
        print(f"Loading label encoder: {ENCODER_PATH}")
        le = joblib.load(ENCODER_PATH)
        return le.classes_
    return None

def load_data_and_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
    if not os.path.exists(X_PATH) or not os.path.exists(Y_PATH):
        raise FileNotFoundError("Feature files or labels not found.")
    
    print(f"Loading model: {MODEL_PATH}")
    model = joblib.load(MODEL_PATH)
    
    print(f"Loading dataset from: {os.path.dirname(X_PATH)}")
    X = np.load(X_PATH)
    y = np.load(Y_PATH)
    
    return model, X, y

# -----------------------------------------------------------------------------
# PLOTTING FUNCTIONS
# -----------------------------------------------------------------------------
def plot_benchmark(my_accuracy):
    benchmarks = {
        "GLCM Only": 26.74,
        "HOG Only": 48.05,
        "MobileNet Only": 85.77,
        "MobileNet + GLCM": 87.43,
        "MobileNet + HOG": 86.10,
        "Paper Proposed Method": 88.49
    }
    
    models = list(benchmarks.keys()) + ["My Hybrid Model"]
    accuracies = list(benchmarks.values()) + [my_accuracy]
    
    plt.figure(figsize=(12, 6))
    colors = ['#aec7e8'] * len(benchmarks) + ['#ff7f0e']
    bars = plt.bar(models, accuracies, color=colors, edgecolor='black', alpha=0.8)
    
    plt.axhline(y=88.49, color='red', linestyle='--', label='Paper Benchmark (88.49%)')
    
    plt.xlabel('Evaluation Methods', fontsize=12, fontweight='bold')
    plt.ylabel('Accuracy (%)', fontsize=12, fontweight='bold')
    plt.title('Hybrid Model vs Research Benchmarks', fontsize=14, fontweight='bold', pad=20)
    plt.xticks(rotation=30, ha='right')
    plt.ylim(0, 110)
    
    for bar in bars:
        yval = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2, yval + 1, f'{yval:.2f}%', ha='center', va='bottom', fontweight='bold')
    
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "benchmark_comparison.png"), dpi=300)
    plt.close()
    return benchmarks

def plot_metrics_summary(results):
    metrics = ['Accuracy', 'Precision', 'Recall', 'F1 Score']
    values = [results[m] for m in metrics]
    
    plt.figure(figsize=(10, 6))
    colors = ['#1f77b4', '#2ca02c', '#d62728', '#9467bd']
    bars = plt.bar(metrics, values, color=colors, edgecolor='black', alpha=0.7)
    
    plt.ylabel('Score (%)', fontsize=12, fontweight='bold')
    plt.title('Model Performance Metrics', fontsize=14, fontweight='bold', pad=20)
    plt.ylim(0, 110)
    
    for bar in bars:
        yval = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2, yval + 1, f'{yval:.2f}%', ha='center', va='bottom', fontweight='bold')
    
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "metrics_summary.png"), dpi=300)
    plt.close()

def plot_confusion_matrix(cm, class_names=None):
    plt.figure(figsize=(14, 12))
    
    # Normalize the confusion matrix
    cm_normalized = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
    
    sns.heatmap(cm_normalized, annot=True, fmt=".2f", cmap="Blues", 
                xticklabels=class_names if class_names is not None else 'auto',
                yticklabels=class_names if class_names is not None else 'auto')
    
    plt.title('Normalized Confusion Matrix', fontsize=16, fontweight='bold', pad=20)
    plt.xlabel('Predicted Label', fontsize=12, fontweight='bold')
    plt.ylabel('True Label', fontsize=12, fontweight='bold')
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "confusion_matrix.png"), dpi=300)
    plt.close()

# -----------------------------------------------------------------------------
# MAIN
# -----------------------------------------------------------------------------
def main():
    try:
        if not os.path.exists(OUTPUT_DIR):
            os.makedirs(OUTPUT_DIR)

        # 1. Load Data
        model, X, y = load_data_and_model()
        class_names = load_labels()
        
        # 2. Split
        print("Splitting dataset (80/20 stratified)...")
        _, X_test, _, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
        
        # 3. Predict
        print("Running inference...")
        y_pred = model.predict(X_test)
        
        # 4. Metrics
        print("Calculating metrics...")
        accuracy = accuracy_score(y_test, y_pred) * 100
        precision = precision_score(y_test, y_pred, average='weighted', zero_division=0) * 100
        recall = recall_score(y_test, y_pred, average='weighted', zero_division=0) * 100
        f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0) * 100
        cm = confusion_matrix(y_test, y_pred)
        
        results = {
            "Accuracy": accuracy,
            "Precision": precision,
            "Recall": recall,
            "F1 Score": f1
        }
        
        # 5. Output
        print("\n" + "="*30)
        print("   FINAL EVALUATION RESULTS")
        print("="*30)
        for k, v in results.items():
            print(f"{k:<12}: {v:>8.2f}%")
        print("="*30)
        
        # 6. Performance vs Paper
        benchmark_acc = 88.49
        improvement = accuracy - benchmark_acc
        if improvement > 0:
            print(f"\nSUCCESS: Outperforms paper by {improvement:.2f}%")
        else:
            print(f"\nBELOW: Gap of {abs(improvement):.2f}% vs benchmark")
        
        # 7. Plots
        print("\nGenerating charts...")
        plot_benchmark(accuracy)
        plot_metrics_summary(results)
        plot_confusion_matrix(cm, class_names)
        
        print(f"\nAll charts saved successfully to: {OUTPUT_DIR}/")
        print("- benchmark_comparison.png")
        print("- metrics_summary.png")
        print("- confusion_matrix.png")

    except Exception as e:
        print(f"\n[ERROR] {e}")

if __name__ == "__main__":
    main()
