@echo off
TITLE Crop Disease Detection System - Launcher

REM Ensure we are in the project root directory
cd /d "%~dp0"

SET BACKEND_PYTHON="C:\Users\NAITIK PATHAK\Downloads\anaconda\python.exe"

echo.
echo ==========================================================
echo  CROP DISEASE DETECTION SYSTEM
echo ==========================================================
echo.

echo [1/2] Launching FastAPI Backend Engine...
echo       (Using Anaconda Python with Hybrid ML Pipeline)
start "Crop AI Backend" cmd /k "echo Starting Backend... && cd backend && %BACKEND_PYTHON% app.py"

echo [2/2] Launching React Frontend (Vite)...
echo.
start "Crop AI Frontend" cmd /k "echo Starting Frontend... && cd frontend_react && npm run dev"

echo.
echo ==========================================================
echo  SYSTEM BOOT INITIATED
echo ==========================================================
echo  Backend API : http://127.0.0.1:8000
echo  Frontend UI  : http://localhost:5173
echo.
echo  Note: Please ensure the API is "Online" in the 
echo  sidebar before uploading images.
echo ==========================================================
echo.
timeout /t 5
pause
