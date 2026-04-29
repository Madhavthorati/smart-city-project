#!/bin/bash

echo "Starting Smart City Backend Server..."
echo ""

echo "Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting server on port 5000..."
echo ""
echo "Backend will be available at: http://localhost:5000"
echo "API Health Check: http://localhost:5000/api/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
