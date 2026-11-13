@echo off
setlocal

echo ==============================================================================
echo CampusChanakya - React Vite Tailwind Frontend
echo ==============================================================================
cd /d "%~dp0frontend"
echo Starting Vite development server on port 5173...
call npm run dev
pause
