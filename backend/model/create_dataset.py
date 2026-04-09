"""
=============================================================================
  create_dataset.py  -  Hybrid Feature Dataset Builder
=============================================================================
  Walks the PlantVillage dataset and extracts a 2852-dimensional hybrid
  feature vector (GLCM + HOG + MobileNetV2) for every image.

  Key design decisions:
    - MobileNetV2 runs in BATCHES of 32 images for ~20x speedup.
    - GLCM and HOG still run per-image (cheap enough to vectorise inline).
    - Checkpoint saves every CHECKPOINT_EVERY images so a crash mid-run
      doesn't lose all progress.
    - Feature size is verified before saving (must equal TOTAL_DIM = 2852).
=============================================================================
  Usage:
      python backend/model/create_dataset.py
=============================================================================
"""

import os
import sys
import cv2
import time
import numpy as np
import joblib
from collections import Counter
from sklearn.preprocessing import LabelEncoder
from sklearn.utils import shuffle

# ─────────────────────────────────────────────────────────────────────────────
# PATHS
# ─────────────────────────────────────────────────────────────────────────────
BACKEND_DIR   = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATASET_PATH  = os.path.join(BACKEND_DIR, "dataset", "PlantVillage")
OUTPUT_DIR    = os.path.join(BACKEND_DIR, "dataset", "features")
CHECKPOINT_DIR = os.path.join(OUTPUT_DIR, "checkpoints")

sys.path.insert(0, BACKEND_DIR)

# ─────────────────────────────────────────────────────────────────────────────
# IMPORTS (after sys.path is set)
# ─────────────────────────────────────────────────────────────────────────────
try:
    from data_loader import load_dataset
    from utils.preprocessing import process_and_segment
    from model.feature_extractor import (
        extract_glcm_features,
        extract_hog_features,
        extract_mobilenet_batch,
        TOTAL_DIM, GLCM_DIM, HOG_DIM, CNN_DIM,
    )
except ImportError as e:
    print(f"[ERROR] Import failed: {e}")
    sys.exit(1)

import numpy as np  # re-import after sys.path update (harmless)

# ─────────────────────────────────────────────────────────────────────────────
# CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────
BATCH_SIZE       = 32       # images per MobileNet forward pass
CHECKPOINT_EVERY = 1000     # save partial results every N images
SAMPLE_SIZE      = 200      # rows in X_sample / y_sample for quick tests
IMAGE_EXTS       = {".jpg", ".jpeg", ".png", ".bmp", ".tiff"}


# ─────────────────────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────────────────────
def _sep(char="=", w=62):
    print(char * w)


def _save_checkpoint(X_list, y_list, idx):
    os.makedirs(CHECKPOINT_DIR, exist_ok=True)
    cp_path = os.path.join(CHECKPOINT_DIR, f"checkpoint_{idx}.npz")
    np.savez(cp_path, X=np.array(X_list, dtype=np.float32), y=np.array(y_list))
    print(f"  [CKPT] Checkpoint saved at {idx} samples -> {cp_path}")


def _load_last_checkpoint():
    """Return (X_list, y_list) from most recent checkpoint, or ([], [])."""
    if not os.path.exists(CHECKPOINT_DIR):
        return [], []
    cpfiles = sorted(
        [f for f in os.listdir(CHECKPOINT_DIR) if f.endswith(".npz")],
        key=lambda f: int(f.split("_")[1].split(".")[0]),
    )
    if not cpfiles:
        return [], []
    latest = os.path.join(CHECKPOINT_DIR, cpfiles[-1])
    data = np.load(latest)
    print(f"[INFO] Resuming from checkpoint: {latest}  ({len(data['X'])} samples)")
    return list(data["X"]), list(data["y"])


# ─────────────────────────────────────────────────────────────────────────────
# MAIN PIPELINE
# ─────────────────────────────────────────────────────────────────────────────
def create_dataset(resume_from_checkpoint: bool = False):
    _sep()
    print("  PHASE 4: Hybrid Feature Dataset Builder")
    print(f"  Feature vector : {TOTAL_DIM} dims  "
          f"({GLCM_DIM} GLCM + {HOG_DIM} HOG + {CNN_DIM} CNN)")
    _sep()

    if not os.path.exists(DATASET_PATH):
        print(f"[ERROR] Dataset not found: {DATASET_PATH}")
        sys.exit(1)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # 1. Collect all image paths & labels
    image_paths, raw_labels = load_dataset(DATASET_PATH)
    total = len(image_paths)
    if total == 0:
        print("[ERROR] No images discovered. Aborting.")
        sys.exit(1)

    print(f"[INFO] {total} images found across {len(set(raw_labels))} classes.")

    # 2. Optionally resume from checkpoint
    X_list, y_list = [], []
    start_idx = 0
    if resume_from_checkpoint:
        X_list, y_list = _load_last_checkpoint()
        start_idx = len(X_list)
        if start_idx > 0:
            image_paths = image_paths[start_idx:]
            raw_labels  = raw_labels[start_idx:]
            print(f"[INFO] Resuming from index {start_idx}. "
                  f"{total - start_idx} images remaining.")

    # 3. Batch buffer
    pending_imgs   = []   # raw BGR uint8 images in current batch
    pending_labels = []   # corresponding labels
    pending_glcm   = []   # pre-computed GLCM features
    pending_hog    = []   # pre-computed HOG features
    skipped        = 0
    processed_so_far = start_idx

    t_start = time.time()

    def flush_batch():
        """Process the pending batch through MobileNet, then merge with GLCM/HOG."""
        nonlocal skipped
        if not pending_imgs:
            return

        # MobileNet batch inference
        try:
            cnn_feats = extract_mobilenet_batch(pending_imgs)  # (N, 1280)
        except Exception as e:
            print(f"  [WARN] MobileNet batch failed: {e} — skipping {len(pending_imgs)} images")
            skipped += len(pending_imgs)
            pending_imgs.clear(); pending_labels.clear()
            pending_glcm.clear(); pending_hog.clear()
            return

        for i in range(len(pending_imgs)):
            g = pending_glcm[i]     # (4,)
            h = pending_hog[i]      # (1568,)
            c = cnn_feats[i]        # (1280,)

            combined = np.concatenate([g, h, c]).astype(np.float32)

            # Sanity: verify dimension
            if combined.shape[0] != TOTAL_DIM:
                print(f"  [WARN] Unexpected feature dim {combined.shape[0]}, skipping.")
                skipped += 1
                continue

            # L2 normalise
            norm = np.linalg.norm(combined)
            if norm > 0:
                combined = combined / norm

            X_list.append(combined)
            y_list.append(pending_labels[i])

        pending_imgs.clear(); pending_labels.clear()
        pending_glcm.clear(); pending_hog.clear()

    print(f"[INFO] Extracting features in batches of {BATCH_SIZE}...\n")

    for idx, (path, label) in enumerate(zip(image_paths, raw_labels), start=1):
        global_idx = start_idx + idx

        # Progress every 100 images
        if idx % 100 == 0:
            elapsed  = time.time() - t_start
            rate     = idx / elapsed if elapsed > 0 else 1
            eta_secs = (total - global_idx) / rate
            eta_min  = int(eta_secs // 60)
            eta_sec  = int(eta_secs % 60)
            print(f"  [{global_idx:>6}/{total}]  done: {len(X_list)}  "
                  f"skipped: {skipped}  ETA: {eta_min}m {eta_sec}s")

        try:
            # Load raw image
            img_bgr = cv2.imread(path, cv2.IMREAD_COLOR)
            if img_bgr is None:
                skipped += 1
                continue

            # Preprocess + segment
            seg = process_and_segment(img_bgr, segment=True)
            if seg is None:
                skipped += 1
                continue

            # Convert back to uint8 for GLCM / HOG / MobileNet
            img_u8 = (seg * 255).astype(np.uint8)

            # GLCM & HOG are fast — compute immediately
            g = extract_glcm_features(seg)
            h = extract_hog_features(seg)

            pending_imgs.append(img_u8)
            pending_labels.append(label)
            pending_glcm.append(g)
            pending_hog.append(h)

            # When batch is full, run MobileNet
            if len(pending_imgs) >= BATCH_SIZE:
                flush_batch()

            # Checkpoint
            if (len(X_list) > 0) and (len(X_list) % CHECKPOINT_EVERY == 0):
                _save_checkpoint(X_list, y_list, len(X_list))

        except Exception as e:
            skipped += 1
            continue

    # Final partial batch
    flush_batch()

    # ─────────────────────────────────────────────────────────────────────────
    # 4. Validate and save
    # ─────────────────────────────────────────────────────────────────────────
    if len(X_list) == 0:
        print("[ERROR] No features extracted. Aborting.")
        sys.exit(1)

    X = np.array(X_list, dtype=np.float32)
    y_raw = np.array(y_list)

    _sep("-")
    print(f"  Extracted  : {len(X)} samples")
    print(f"  Skipped    : {skipped} images")
    print(f"  Feature dim: {X.shape[1]}  (expected {TOTAL_DIM})")
    _sep("-")

    if X.shape[1] != TOTAL_DIM:
        print(f"[ERROR] Feature dimension mismatch! Got {X.shape[1]}, expected {TOTAL_DIM}")
        sys.exit(1)
    print("[OK]   Feature dimension verified: MobileNetV2 IS included.")

    # Label encoding
    le = LabelEncoder()
    y_encoded = le.fit_transform(y_raw)

    # Shuffle
    X, y_encoded = shuffle(X, y_encoded, random_state=42)

    # Save
    np.save(os.path.join(OUTPUT_DIR, "X.npy"), X)
    np.save(os.path.join(OUTPUT_DIR, "y.npy"), y_encoded)
    joblib.dump(le, os.path.join(OUTPUT_DIR, "label_encoder.pkl"))

    # Sample subset
    n_samp = min(SAMPLE_SIZE, len(X))
    np.save(os.path.join(OUTPUT_DIR, "X_sample.npy"), X[:n_samp])
    np.save(os.path.join(OUTPUT_DIR, "y_sample.npy"), y_encoded[:n_samp])

    elapsed_total = time.time() - t_start
    _sep()
    print("  PHASE 4 COMPLETE")
    _sep()
    print(f"  Samples saved     : {len(X)}")
    print(f"  Feature size      : {X.shape[1]}  (GLCM {GLCM_DIM} + HOG {HOG_DIM} + CNN {CNN_DIM})")
    print(f"  Classes           : {len(le.classes_)}")
    print(f"  X.npy shape       : {X.shape}")
    print(f"  Time elapsed      : {int(elapsed_total // 60)}m {int(elapsed_total % 60)}s")
    print(f"  Saved to          : {OUTPUT_DIR}")
    _sep()
    print("\n  Class distribution:")
    dist = Counter(y_raw)
    for cls, cnt in sorted(dist.items()):
        print(f"    {cls}: {cnt}")
    _sep()


# ─────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Hybrid Feature Dataset Builder")
    parser.add_argument(
        "--resume", action="store_true",
        help="Resume from last checkpoint instead of starting fresh."
    )
    args = parser.parse_args()
    create_dataset(resume_from_checkpoint=args.resume)
