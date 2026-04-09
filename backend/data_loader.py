import os
import cv2
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder


def load_dataset(dataset_path):
    """Load image file paths and corresponding labels from dataset directory.

    Args:
        dataset_path (str): Path to the root folder containing class subfolders.

    Returns:
        tuple: (list_of_image_paths, list_of_labels)
    """
    image_paths = []
    labels = []
    # Iterate over each subdirectory (class label)
    for label_name in sorted(os.listdir(dataset_path)):
        label_dir = os.path.join(dataset_path, label_name)
        if not os.path.isdir(label_dir) or label_name == "PlantVillage":
            continue
            
        # Gather image files recursively within the class folder
        for root, _, files in os.walk(label_dir):
            for fname in files:
                # Accept common image extensions
                if fname.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff')):
                    img_path = os.path.join(root, fname)
                    image_paths.append(img_path)
                    labels.append(label_name)
    return image_paths, labels


def preprocess_image(image_path, target_size=(224, 224)):
    """Read an image, resize, normalize and return as a NumPy array.

    Args:
        image_path (str): Path to the image file.
        target_size (tuple): Desired image size (width, height).

    Returns:
        np.ndarray or None: Processed image array or None if loading fails.
    """
    try:
        # cv2 loads in BGR format; convert to RGB for consistency with most ML pipelines
        img = cv2.imread(image_path, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("cv2.imread returned None")
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img_resized = cv2.resize(img, target_size, interpolation=cv2.INTER_AREA)
        img_normalized = img_resized.astype(np.float32) / 255.0
        return img_normalized
    except Exception as e:
        print(f"[WARNING] Failed to process image {image_path}: {e}")
        return None


def prepare_data(dataset_path, test_size=0.2, random_state=42):
    """Full pipeline: load paths, preprocess images, encode labels, split.

    Args:
        dataset_path (str): Root directory of the dataset.
        test_size (float): Fraction of data to reserve for testing.
        random_state (int): Seed for reproducibility.

    Returns:
        X_train, X_test, y_train, y_test, label_encoder
    """
    # Load file paths and raw labels
    image_paths, raw_labels = load_dataset(dataset_path)
    print(f"[INFO] Loaded {len(image_paths)} image paths from {len(set(raw_labels))} classes.")

    # Preprocess images efficiently using a list comprehension with filtering
    processed_images = []
    processed_labels = []
    for path, label in zip(image_paths, raw_labels):
        img = preprocess_image(path)
        if img is not None:
            processed_images.append(img)
            processed_labels.append(label)
    # Convert to NumPy arrays
    X = np.stack(processed_images)  # shape: (N, 224, 224, 3)
    y = np.array(processed_labels)

    # Encode string labels to integers
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    # Train‑test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=test_size, random_state=random_state, stratify=y_encoded
    )
    return X_train, X_test, y_train, y_test, label_encoder


def print_dataset_summary(dataset_path, label_encoder=None):
    """Print a quick summary of the dataset.

    Args:
        dataset_path (str): Path to dataset root.
        label_encoder (LabelEncoder, optional): Fitted encoder to show class mapping.
    """
    image_paths, raw_labels = load_dataset(dataset_path)
    total_images = len(image_paths)
    num_classes = len(set(raw_labels))
    sample_img = None
    # Find first readable image for shape info
    for p in image_paths:
        sample_img = preprocess_image(p)
        if sample_img is not None:
            break
    sample_shape = sample_img.shape if sample_img is not None else "N/A"
    # Class distribution
    from collections import Counter
    distribution = Counter(raw_labels)
    print("--- Dataset Summary ---")
    print(f"Total images   : {total_images}")
    print(f"Number of classes: {num_classes}")
    print(f"Sample image shape: {sample_shape}")
    print("Class distribution:")
    for cls, cnt in sorted(distribution.items()):
        print(f"  {cls}: {cnt}")
    if label_encoder is not None:
        print("Label encoding mapping:")
        for cls, idx in zip(label_encoder.classes_, range(len(label_encoder.classes_))):
            print(f"  {cls} -> {idx}")


if __name__ == "__main__":
    DATASET_ROOT = os.path.join(os.path.dirname(__file__), "dataset", "plant_village")
    # Verify that the dataset directory exists
    if not os.path.isdir(DATASET_ROOT):
        raise FileNotFoundError(f"Dataset directory not found: {DATASET_ROOT}")
    # Prepare data (Limit images if just checking, as 41000 items is roughly 25GB in memory)
    X_train, X_test, y_train, y_test, le = prepare_data(DATASET_ROOT)
    # Print summary
    print_dataset_summary(DATASET_ROOT, label_encoder=le)
    # Optionally, print shapes of splits
    print("\n--- Split Shapes ---")
    print(f"X_train shape: {X_train.shape}")
    print(f"X_test  shape: {X_test.shape}")
    print(f"y_train shape: {y_train.shape}")
    print(f"y_test  shape: {y_test.shape}")
