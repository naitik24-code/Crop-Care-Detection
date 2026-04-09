import cv2
import numpy as np
import matplotlib.pyplot as plt
import os

def preprocess_image(image, target_size=(224, 224), normalize=True):
    """
    Resize, blur (reduce noise), and optionally normalize an image.
    
    Args:
        image (np.ndarray): Input raw image in BGR format.
        target_size (tuple): Width and height to resize to.
        normalize (bool): Whether to normalize pixel values to [0, 1].
        
    Returns:
        np.ndarray: Preprocessed image. Returns None if input is invalid.
    """
    if image is None or not isinstance(image, np.ndarray):
        print("[WARNING] Invalid or empty image provided to preprocess_image.")
        return None
        
    try:
        # Resize image
        img_resized = cv2.resize(image, target_size, interpolation=cv2.INTER_AREA)
        
        # Apply Gaussian Blur to reduce noise
        img_blurred = cv2.GaussianBlur(img_resized, (5, 5), 0)
        
        # Normalize pixel values
        if normalize:
            img_processed = img_blurred.astype(np.float32) / 255.0
        else:
            img_processed = img_blurred
            
        return img_processed
        
    except Exception as e:
        print(f"[ERROR] Failed during preprocessing: {e}")
        return None


def segment_leaf(image, lower_hsv=(25, 40, 40), upper_hsv=(90, 255, 255)):
    """
    Isolate the leaf area using HSV color bounds and morphological operations.
    
    Args:
        image (np.ndarray): Input BGR image (should be uint8 format, 0-255).
        lower_hsv (tuple): Lower bound for leaf color in HSV.
        upper_hsv (tuple): Upper bound for leaf color in HSV.
        
    Returns:
        np.ndarray: Segmented image with background removed (black background).
    """
    if image is None or not isinstance(image, np.ndarray):
        print("[WARNING] Invalid or empty image provided to segment_leaf.")
        return None

    try:
        # Convert to HSV color space
        hsv_img = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        
        # Create mask for green/leaf colors
        mask = cv2.inRange(hsv_img, np.array(lower_hsv), np.array(upper_hsv))
        
        # Morphological operations to clean the mask (remove small noise)
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        mask_cleaned = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
        mask_cleaned = cv2.morphologyEx(mask_cleaned, cv2.MORPH_CLOSE, kernel, iterations=2)
        
        # Find contours to fill in the holes (like brown disease spots) inside the leaf
        contours, _ = cv2.findContours(mask_cleaned, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            # Assume the largest contour is the leaf
            largest_contour = max(contours, key=cv2.contourArea)
            # Create a completely blank mask
            filled_mask = np.zeros_like(mask_cleaned)
            # Fill the entire leaf boundary so diseased spots inside are kept
            cv2.drawContours(filled_mask, [largest_contour], -1, 255, thickness=cv2.FILLED)
            mask_cleaned = filled_mask
            
        # Apply the mask to extract the leaf
        segmented_img = cv2.bitwise_and(image, image, mask=mask_cleaned)
        
        return segmented_img
        
    except Exception as e:
        print(f"[ERROR] Failed during leaf segmentation: {e}")
        return None


def process_and_segment(image, segment=True, target_size=(224, 224), 
                        lower_hsv=(25, 40, 40), upper_hsv=(90, 255, 255)):
    """
    Combine preprocessing and optional segmentation into a single step.
    
    Args:
        image (np.ndarray): Raw BGR image.
        segment (bool): Whether to apply leaf segmentation (background removal).
        target_size (tuple): Output image dimensions.
        lower_hsv, upper_hsv: Dynamic HSV color ranges if segmenting.
    
    Returns:
        np.ndarray: The finalized clean image, normalized [0, 1].
    """
    if image is None:
        return None
        
    # Step 1: Preprocess (Resize & Blur), but DO NOT normalize yet
    # because segmentation works best/easiest with standard 0-255 uint8 BGR
    img_processed = preprocess_image(image, target_size=target_size, normalize=False)
    
    if img_processed is None:
        return None
        
    # Step 2: Segment the leaf
    if segment:
        img_processed = segment_leaf(img_processed, lower_hsv=lower_hsv, upper_hsv=upper_hsv)
        
    # Step 3: Normalize to [0, 1] output
    final_img = img_processed.astype(np.float32) / 255.0
    return final_img


def test_preprocessing():
    """
    Load a sample image and visualize the original alongside the segmented version.
    Requires a valid dataset path and an image. 
    """
    # Attempt to locate a sample file from the dataset location used in Phase 1
    # Check parent directory depending on where this file is run
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dataset_dir = os.path.join(base_dir, "dataset", "PlantVillage")
    
    sample_img_path = None
    if os.path.exists(dataset_dir):
        # Find the first valid real image file
        for root, dirs, files in os.walk(dataset_dir):
            for file in files:
                if file.lower().endswith(('.png', '.jpg', '.jpeg')) and not file.startswith('dummy'):
                    sample_img_path = os.path.join(root, file)
                    break
            if sample_img_path:
                break
                
    if not sample_img_path:
        print("[ERROR] No sample images found in backend/dataset/plant_village to test.")
        return

    print(f"[INFO] Testing visualization on: {sample_img_path}")
    
    # Load raw image
    raw_img = cv2.imread(sample_img_path, cv2.IMREAD_COLOR)
    if raw_img is None:
        print(f"[ERROR] cv2 failed to read image at {sample_img_path}")
        return
        
    # Run the full pipeline (segment ON)
    processed_segmented = process_and_segment(raw_img, segment=True)
    
    # Run pipeline with segment OFF for comparison
    processed_only = process_and_segment(raw_img, segment=False)
    
    if processed_segmented is None or processed_only is None:
        return

    # plt/matplotlib expects RGB format. OpenCV loads BGR. We convert for visual display.
    # Note: our output arrays are floats in [0, 1] range. Matplotlib handles this natively.
    raw_rgb = cv2.cvtColor(raw_img, cv2.COLOR_BGR2RGB)
    
    # Reverse color channels for visualization since our process takes BGR and outputs normalized BGR setup
    # Matplotlib will display normalized BGR as weird colors, we must flip [..., ::-1] to [..., RGB]
    proc_rgb = processed_only[..., ::-1]
    seg_rgb = processed_segmented[..., ::-1]

    # Plot results
    plt.figure(figsize=(15, 5))
    
    plt.subplot(1, 3, 1)
    plt.title("Original Image")
    plt.imshow(raw_rgb)
    plt.axis('off')
    
    plt.subplot(1, 3, 2)
    plt.title("Preprocessed Only\n(Resized, Blurred, Normalized)")
    plt.imshow(proc_rgb)
    plt.axis('off')

    plt.subplot(1, 3, 3)
    plt.title("Preprocessed + Segmented\n(Background Removed)")
    plt.imshow(seg_rgb)
    plt.axis('off')

    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    # Test visualization if run directly
    test_preprocessing()
