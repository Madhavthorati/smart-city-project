@echo off
echo Starting Smart City Backend Server...
echo.

echo Checking dependencies...
if not exist node_modules (
    echo Installing dependencies...
    npm install
)

echo Starting server on port 5000...
echo.
echo Backend will be available at: http://localhost:5000
echo API Health Check: http://localhost:5000/api/health
echo.
echo Press Ctrl+C to stop the server
echo.

npm start
