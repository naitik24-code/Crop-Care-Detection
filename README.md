<div align="center">
  <img alt="PlantWise AI Concept" src="https://upload.wikimedia.org/wikipedia/commons/1/14/Tomato_leaf_healthy.jpg" width="100%" style="border-radius:20px"/>
  <h1 align="center">CropCare Detection AI</h1>
  <p align="center"><strong>A Lightning-Fast, Hybrid End-to-End Crop Disease Analytics Engine</strong></p>
</div>

<br/>

## 🌿 Project Overview

CropCare is an absolute powerhouse of a diagnostic engine. Designed strictly for speed, reliability, and precision, this architecture implements a **Hybrid Machine Learning Pipeline** capable of segmenting, extracting, and predicting leaf pathogens with sub-second latency. 

It completely abandons bulky cloud infrastructures for a hyper-efficient `FastAPI + LightGBM` backend paired intrinsically with a Native `Vanilla JS + TailwindCSS` multi-page dashboard. 

## ⚡ Features

- **Automated Mask Segmentation:** Utilizes HSV bounds to instantly remove backgrounds and isolate organic leaf matter prior to algorithmic scanning.
- **Hybrid Feature Extraction (GLCM + HOG):** Calculates highly complex geometric texture grids (Gray-Level Co-occurrence Matrices) and Histogram of Oriented Gradients to capture advanced microscopic decay indicators, entirely independently of heavy CNNs like TensorFlow or PyTorch.
- **Micro-Latency Native SPA Front-End:** Engineered entirely on Vanilla JavaScript to bypass the massive compile times and payload weight of Node.js or React.
- **Expert Domain Mapping:** API directly yields localized treatment protocols directly into the UI.

## 🛠️ Tech Stack

### AI / Backend Engine
- **Core:** Python 3.x
- **Framework:** FastAPI (Uvicorn ASGI)
- **Computer Vision:** `opencv-python-headless`, `scikit-image`
- **Predictive ML:** `LightGBM`, `Scikit-Learn`

### User Interface Layer
- **Markup/Styling:** Raw HTML5, TailwindCSS (CDN Engine)
- **State Management:** Native Vanilla JavaScript (`app.js`)
- **Prototyping:** Model Context Protocol (Stitch) 

---

## 🚀 Setup Instructions

### 1. Backend API Configuration
To run the high-speed backend interface natively on your machine:
```bash
# Clone Repository and Configure Virtual Environment (Optional)
git clone https://github.com/yourusername/cropcare-ai.git
cd cropcare-ai

# Install specialized requirements
pip install -r requirements.txt

# Ignite the ASGI Production Server
python backend/app.py
```
*The endpoint will be exclusively available at `http://localhost:8001/predict`*

### 2. Frontend Launch
Because CropCare utilizes an absurdly optimized Vanilla DOM, there is **zero installation required**. 
Simply natively open `frontend/index.html` inside any modern browser (Chrome, Edge, Safari) and interact directly. 

---

## 📡 API Usage

**`POST /predict`**
Accepts a MultiPart Image file. Performs HSV segmentation, calculates Gray-Level contours, evaluates mathematical HOG vectors, targets the LightGBM Matrix, and routes a verified prediction in milliseconds.

**Response Schema:**
```json
{
  "prediction": "Tomato___Early_blight",
  "confidence": 0.9412,
  "status": "success",
  "description": "Fungal plant disease that causes dark, concentric lesions on lower leaves.",
  "solution": "Apply copper-based fungicide. Prune bottom leaves. Ensure adequate spacing."
}
```

---

## 🌐 Cloud Deployment (Render / Railway)

1. Connect your Github Repository to your chosen cloud execution environment.
2. Ensure the Build Command targets `pip install -r requirements.txt`.
3. Set the internal Start Command strictly to:
```bash
uvicorn app:app --host 0.0.0.0 --port 10000
```
4. Map the frontend UI JavaScript fetches directly to your newly deployed cloud URL limit.

## ©️ Licensing
Engineered as an advanced structural AI Prototype. Open Source permitted.
