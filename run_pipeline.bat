@echo off
REM ============================================================
REM  run_pipeline.bat
REM  Runs the full Hybrid Feature Rebuild Pipeline using the
REM  Anaconda Python that has TensorFlow + LightGBM installed.
REM ============================================================

SET PYTHON="C:\Users\NAITIK PATHAK\Downloads\anaconda\python.exe"
SET PROJECT="c:\Users\NAITIK PATHAK\Desktop\PROJECT\Crop care Detection"

echo.
echo ============================================================
echo  STEP 1 of 3 : Building Hybrid Feature Dataset
echo  (GLCM + HOG + MobileNetV2 - expect 30-120 minutes)
echo ============================================================
%PYTHON% %PROJECT%\backend\model\create_dataset.py
IF ERRORLEVEL 1 (
    echo [ERROR] Dataset creation failed. Stopping.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo  STEP 2 of 3 : Training LightGBM Classifier
echo  (expect 5-20 minutes)
echo ============================================================
%PYTHON% %PROJECT%\backend\model\train_model.py
IF ERRORLEVEL 1 (
    echo [ERROR] Training failed. Stopping.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo  STEP 3 of 3 : Evaluating and Comparing with Benchmarks
echo ============================================================
%PYTHON% %PROJECT%\backend\evaluate_model.py
IF ERRORLEVEL 1 (
    echo [ERROR] Evaluation failed.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo  ALL DONE - Check backend/model/ for results.
echo ============================================================
pause
