#!/bin/bash
echo "Starting Credit Transfer System..."

# Start Backend in background
echo "Starting Backend on port 5001..."
cd backend
npm run dev &
BACKEND_PID=$!

# Start Frontend
echo "Starting Frontend on port 5173..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Function to kill both processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

# Trap Ctrl+C (SIGINT)
trap cleanup SIGINT

# Wait for processes
wait
