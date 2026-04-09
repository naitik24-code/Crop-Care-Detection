"""
=============================================================================
  feature_extractor.py  -  Hybrid Feature Extraction Pipeline
=============================================================================
  Extracts a 2852-dimensional hybrid feature vector per image:
    GLCM       :    4 features  (texture)
    HOG        : 1568 features  (shape / edges)
    MobileNetV2: 1280 features  (deep semantic features)
  Total        : 2852 features

  MobileNetV2 is loaded ONCE at module level and shared across all calls.
  For batch processing (create_dataset), use extract_mobilenet_batch().
=============================================================================
"""

import os
import cv2
import numpy as np

# Suppress verbose TensorFlow log spam
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

from skimage.feature import graycomatrix, graycoprops, hog as skimage_hog

from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
from tensorflow.keras.preprocessing.image import img_to_array

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTS — feature dimensions must match consistently across the pipeline
# ─────────────────────────────────────────────────────────────────────────────
GLCM_DIM = 4         # contrast, correlation, energy, homogeneity
HOG_PIX   = 16       # pixels_per_cell
HOG_ORI   = 8        # orientations
CNN_DIM   = 1280     # MobileNetV2 avg-pool output
TARGET_SIZE = (224, 224)

# Compute HOG dimension for a 224x224 image, 16x16 cells, 1x1 blocks, 8 orientations
_HOG_CELLS = (TARGET_SIZE[0] // HOG_PIX) * (TARGET_SIZE[1] // HOG_PIX)  # 196
HOG_DIM   = _HOG_CELLS * HOG_ORI                                          # 1568
TOTAL_DIM = GLCM_DIM + HOG_DIM + CNN_DIM                                  # 2852

# ─────────────────────────────────────────────────────────────────────────────
# GLOBAL MODEL — loaded once at import time
# ─────────────────────────────────────────────────────────────────────────────
print("[INFO] Loading MobileNetV2 (imagenet weights, include_top=False, pooling=avg)...")
cnn_model = MobileNetV2(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3),
    pooling="avg"
)
cnn_model.trainable = False   # freeze — inference only
print(f"[OK]   MobileNetV2 ready. Output dim: {CNN_DIM}  |  Total hybrid dim: {TOTAL_DIM}")


# ─────────────────────────────────────────────────────────────────────────────
# UTILITY
# ─────────────────────────────────────────────────────────────────────────────
def _to_uint8(image: np.ndarray) -> np.ndarray:
    """Convert float [0,1] image back to uint8 [0,255] for GLCM / HOG."""
    if image is None:
        return None
    if image.dtype in (np.float32, np.float64) and image.max() <= 1.0:
        return (image * 255).astype(np.uint8)
    return image.astype(np.uint8)


def _resize_224(img_uint8: np.ndarray) -> np.ndarray:
    """Ensure image is exactly 224×224."""
    if img_uint8.shape[:2] != (224, 224):
        return cv2.resize(img_uint8, (224, 224), interpolation=cv2.INTER_AREA)
    return img_uint8


# ─────────────────────────────────────────────────────────────────────────────
# GLCM — 4 texture features
# ─────────────────────────────────────────────────────────────────────────────
def extract_glcm_features(image: np.ndarray) -> np.ndarray:
    """
    Extract 4 GLCM texture descriptors:
    contrast, correlation, energy, homogeneity.
    """
    img_u8 = _to_uint8(image)
    gray   = cv2.cvtColor(img_u8, cv2.COLOR_BGR2GRAY)

    glcm = graycomatrix(
        gray, distances=[1], angles=[0],
        levels=256, symmetric=True, normed=True
    )
    feats = np.array([
        graycoprops(glcm, "contrast")[0, 0],
        graycoprops(glcm, "correlation")[0, 0],
        graycoprops(glcm, "energy")[0, 0],
        graycoprops(glcm, "homogeneity")[0, 0],
    ], dtype=np.float32)
    return feats   # shape: (4,)


# ─────────────────────────────────────────────────────────────────────────────
# HOG — 1568 shape features
# ─────────────────────────────────────────────────────────────────────────────
def extract_hog_features(image: np.ndarray) -> np.ndarray:
    """
    Extract HOG shape descriptors.
    For 224x224, 16x16 cells, 8 orientations, 1x1 blocks -> 1568 features.
    """
    img_u8 = _to_uint8(image)
    img_u8 = _resize_224(img_u8)
    gray   = cv2.cvtColor(img_u8, cv2.COLOR_BGR2GRAY)

    feats = skimage_hog(
        gray,
        orientations=HOG_ORI,
        pixels_per_cell=(HOG_PIX, HOG_PIX),
        cells_per_block=(1, 1),
        visualize=False,
        feature_vector=True,
    )
    return feats.astype(np.float32)   # shape: (1568,)


# ─────────────────────────────────────────────────────────────────────────────
# MobileNetV2 — 1280 deep features (single-image mode)
# ─────────────────────────────────────────────────────────────────────────────
def extract_cnn_features(image: np.ndarray) -> np.ndarray:
    """
    Extract 1280-dimensional MobileNetV2 deep features.
    Uses preprocess_input() to scale [-1, 1] as required by MobileNetV2.
    """
    img_u8     = _to_uint8(image)
    img_u8     = _resize_224(img_u8)
    img_arr    = img_to_array(img_u8)                      # (224, 224, 3)
    img_arr    = np.expand_dims(img_arr, axis=0)            # (1, 224, 224, 3)
    img_arr    = preprocess_input(img_arr)                  # scale to [-1, 1]
    features   = cnn_model.predict(img_arr, verbose=0)      # (1, 1280)
    return features.flatten().astype(np.float32)            # (1280,)


# ─────────────────────────────────────────────────────────────────────────────
# MobileNetV2 BATCH mode — faster for dataset generation
# ─────────────────────────────────────────────────────────────────────────────
def extract_mobilenet_batch(images_uint8: list) -> np.ndarray:
    """
    Extract MobileNetV2 features for a batch of images in one forward pass.

    Args:
        images_uint8: list of BGR uint8 ndarray images (any size).

    Returns:
        np.ndarray of shape (N, 1280), dtype float32.
    """
    batch = []
    for img in images_uint8:
        img = _resize_224(img)
        arr = img_to_array(img)
        batch.append(arr)

    batch_arr = np.stack(batch, axis=0)             # (N, 224, 224, 3)
    batch_arr = preprocess_input(batch_arr)          # scale to [-1, 1]
    feats     = cnn_model.predict(batch_arr, verbose=0)   # (N, 1280)
    return feats.astype(np.float32)


# ─────────────────────────────────────────────────────────────────────────────
# HYBRID — full 2852-feature vector (single image)
# ─────────────────────────────────────────────────────────────────────────────
def extract_features(image: np.ndarray,
                     use_glcm: bool = True,
                     use_hog: bool  = True,
                     use_cnn: bool  = True) -> np.ndarray:
    """
    Combine GLCM + HOG + MobileNetV2 into a single flat feature vector.

    Returns:
        np.ndarray of shape (2852,) with L2-normalised values.
        Returns None if image is None.
    """
    if image is None:
        return None

    parts = []

    if use_glcm:
        parts.append(extract_glcm_features(image))    # (4,)

    if use_hog:
        parts.append(extract_hog_features(image))     # (1568,)

    if use_cnn:
        parts.append(extract_cnn_features(image))     # (1280,)

    if not parts:
        return np.array([], dtype=np.float32)

    combined = np.concatenate(parts).astype(np.float32)

    # L2 normalisation keeps the vector unit-length.
    # This prevents large CNN magnitude from drowning GLCM/HOG signals.
    norm = np.linalg.norm(combined)
    if norm > 0:
        combined = combined / norm

    return combined   # shape: (2852,)


# ─────────────────────────────────────────────────────────────────────────────
# QUICK SELF-TEST
# ─────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys

    parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    sys.path.append(parent_dir)

    try:
        from utils.preprocessing import process_and_segment
    except ImportError:
        print("[ERROR] Cannot import preprocessing.py. Run from backend directory.")
        sys.exit(1)

    dataset_dir = os.path.join(parent_dir, "dataset", "PlantVillage")
    test_path   = None

    if os.path.exists(dataset_dir):
        for root, _, files in os.walk(dataset_dir):
            for f in files:
                if f.lower().endswith((".png", ".jpg", ".jpeg")):
                    test_path = os.path.join(root, f)
                    break
            if test_path:
                break

    if not test_path:
        print("[ERROR] No images found in dataset/PlantVillage.")
        sys.exit(1)

    print(f"[INFO] Test image: {test_path}")
    raw = cv2.imread(test_path, cv2.IMREAD_COLOR)
    seg = process_and_segment(raw, segment=True)

    g = extract_glcm_features(seg)
    h = extract_hog_features(seg)
    c = extract_cnn_features(seg)
    v = extract_features(seg)

    print(f"  GLCM shape : {g.shape}   -> expected (4,)")
    print(f"  HOG  shape : {h.shape}   -> expected ({HOG_DIM},)")
    print(f"  CNN  shape : {c.shape}   -> expected ({CNN_DIM},)")
    print(f"  Full shape : {v.shape}   -> expected ({TOTAL_DIM},)")
    assert v.shape[0] == TOTAL_DIM, f"ERROR: expected {TOTAL_DIM} features, got {v.shape[0]}"
    print("[PASS] Feature extraction self-test passed.")
