@echo off
echo ==============================================================================
echo CampusChanakya - Unified Launcher
echo Launching Backend (Port 8080) and Frontend (Port 5173) in separate windows...
echo ==============================================================================
start "CampusChanakya Backend (Port 8080)" cmd /k "%~dp0run-backend.bat"
start "CampusChanakya Frontend (Port 5173)" cmd /k "%~dp0run-frontend.bat"
