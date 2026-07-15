@echo off
echo Iniciando backend Licoreria de Baco...
cd /d "%~dp0"
python -m uvicorn main:app --reload --port 8000
