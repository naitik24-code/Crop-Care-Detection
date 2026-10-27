import os
import sys

# Workaround for Intel OpenMP multiple runtime conflict on Windows
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import cv2
import numpy as np
import joblib
import uvicorn
import logging
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import asyncio

# Ensure custom modules from utils and model folders can be imported correctly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.preprocessing import process_and_segment
from model.feature_extractor import extract_features

# ==============================================================================
# ML Hardware Optimization
# ==============================================================================
try:
    import tensorflow as tf
    gpus = tf.config.list_physical_devices('GPU')
    if gpus:
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
        print(f"[INFO] TensorFlow Memory Growth enabled for {len(gpus)} GPU(s)")
except Exception as e:
    print(f"[WARN] Could not optimize TF memory: {e}")

# ==============================================================================
# Initialize FastAPI Core
# ==============================================================================
app = FastAPI(
    title="CropCare Analytics Engine",
    description="Enterprise-grade AI backend for botanical disease diagnostics.",
    version="2.0.0"
)

# Global Exception Handler for robustness
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Critical Engine Fault: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"status": "error", "message": "Internal AI Engine Fault. Check hardware logs."},
    )

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

DISEASE_INFO = {
    "Tomato___Early_blight": {
        "desc": "Fungal plant disease that causes dark, concentric lesions on lower leaves.",
        "sol": "Apply copper-based fungicide. Prune bottom leaves. Ensure adequate spacing."
    },
    "Tomato___Target_Spot": {
        "desc": "Fungal disease causing dark brown lesions with concentric rings on leaves and fruit.",
        "sol": "Increase airflow immediately. Apply broad-spectrum fungicide. Avoid overhead watering."
    },
    "Apple___Apple_scab": {
        "desc": "Significant fungal disease caused by Venturia inaequalis. Shows advanced velvet-like olive spots.",
        "sol": "Apply fungicides in early spring. Remove fallen leaves at the end of the season to prevent wintering."
    },
    "Potato___Late_blight": {
        "desc": "Devastating water mold infection. Causes fast-spreading watery lesions.",
        "sol": "Treat immediately with a systemic fungicide. Destroy infected plants entirely. Do not compost."
    },
}

def get_disease_info(disease_name):
    # Retrieve specific tuple or generic fallback
    info = DISEASE_INFO.get(disease_name)
    if info:
        return info["desc"], info["sol"]
    return (
        f"The analysis detected indicators consistent with {disease_name.replace('___', ' ').replace('_', ' ')}. Cross-reference with standard botanical databases.",
        "Isolate affected crop dynamically to prevent spread. Verify environmental humidity and airflow. Review full chemical treatment protocol."
    )


# Allow Cross-Origin Resource Sharing (CORS) for React Frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================================================================
# Global Machine Learning Loaders
# ==============================================================================
# We load these globally to avoid massive Disk I/O reloading on every HTTP request
print("[INFO] Attempting to mount ML variables to Global memory...")

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BACKEND_DIR, "model", "lightgbm_model.pkl")
ENCODER_PATH = os.path.join(BACKEND_DIR, "dataset", "features", "label_encoder.pkl")

ml_model = None
label_encoder = None

try:
    if os.path.exists(MODEL_PATH) and os.path.exists(ENCODER_PATH):
        ml_model = joblib.load(MODEL_PATH)
        label_encoder = joblib.load(ENCODER_PATH)
        print("[SUCCESS] Found and mounted LightGBM model and Label Encoder!")
    else:
        print(f"[WARNING] ML models not found. Please ensure Phase 4 and 5 were executed completely physically.")
except Exception as e:
    print(f"[ERROR] Failed to mount ML resources: {e}")

# ==============================================================================
# System Endpoints
# ==============================================================================
@app.get("/")
def read_root():
    """Testing Endpoint to verify server connectivity."""
    return {"message": "Crop Disease Detection API is running"}

@app.get("/health")
def health_check():
    """Deep verification to check if the ML engine is fully ready."""
    return {
        "status": "Healthy",
        "ml_model_loaded": ml_model is not None,
        "label_encoder_loaded": label_encoder is not None
    }

# ==============================================================================
# AI Predictor API Core (Phase 6)
# ==============================================================================
@app.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    """
    Accepts a leaf image (Multipart), mathematically processes and segments it, 
    calculates GLCM/HOG vectors, and requests an AI disease prediction directly.
    """
    if ml_model is None or label_encoder is None:
        raise HTTPException(status_code=503, detail="Machine Learning Models are offline. Ensure Model Training generated physical files.")

    # Validate image formatting loosely
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid File Type. Please ensure it is a valid image.")

    print(f"[PREDICT] Received image parsing request for: {file.filename}")

    try:
        # Step 1: Decode multipart HTTP raw byte data into a local OpenCV Memory array
        image_bytes = await file.read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        img_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        logger.info(f"Successfully decoded image. Shape: {img_bgr.shape}")

        if img_bgr is None:
            raise HTTPException(status_code=400, detail="The image is corrupted or cannot be interpreted by OpenCV.")

        # Step 2: Phase 2 Pipeline -> Noise Blur, Resizing to 224x224, and Contour Background Removal
        segmented_img = await asyncio.to_thread(process_and_segment, img_bgr, True)
        if segmented_img is None:
            raise HTTPException(status_code=500, detail="Internal Algorithm failed to segment leaf.")

        # Step 3: Phase 3 Pipeline -> Texture & Shape Deep Analytics (GLCM + HOG)
        features = await asyncio.to_thread(extract_features, segmented_img)
        if features is None or len(features) == 0:
            raise HTTPException(status_code=500, detail="Internal Algorithm failed to extract math feature vectors.")

        # Step 4: Machine Learning Predictor Re-shape Request 
        # Models expect batches, so we reshape 1D Vector -> 2D Vector: `(1, FeatureLength)`
        X_test_vector = features.reshape(1, -1)
        
        # Calculate algorithmic decisions
        # Retrieve numerical identifier mapped (Ex: label #12)
        numeric_prediction = ml_model.predict(X_test_vector)[0]
        
        # Calculate absolute AI prediction confidence / 100 probability
        probabilities = ml_model.predict_proba(X_test_vector)[0]
        confidence = float(np.max(probabilities))

        # Re-convert numeric target identifiers back to actual Leaf Disease standard name string
        disease_name = label_encoder.inverse_transform([numeric_prediction])[0]
        logger.info(f"Prediction: {disease_name} | Confidence: {confidence:.2f}")

        desc, sol = get_disease_info(disease_name)

        # Final Return JSON
        return JSONResponse(content={
            "prediction": disease_name,
            "confidence": confidence,
            "filename": file.filename,
            "status": "success",
            "description": desc,
            "solution": sol
        })

    except HTTPException as ext:
        raise ext
    except Exception as e:
        print(f"[ERROR] Engine fault during evaluation: {e}")
        raise HTTPException(status_code=500, detail="Internal Processing Engine Error. Check logs for details.")

# ==============================================================================
# Development Local Server Boot Sequence
# ==============================================================================
if __name__ == "__main__":
    # Spins up standard HTTP backend engine via uvicorn if ran as script
    print("[INFO] Igniting standard FastAPI production engine...")
    uvicorn.run("app:app", host="0.0.0.0", port=8001, reload=False)
