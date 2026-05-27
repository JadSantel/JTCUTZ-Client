#!/bin/bash

# Performance Testing Quick Start Script
# This script helps you run performance tests easily

set -e

echo "======================================"
echo "JTCUTZ Performance Testing Tool"
echo "======================================"
echo ""

# Check if K6 is installed
if ! command -v k6 &> /dev/null; then
    echo "❌ K6 is not installed. Please install it first:"
    echo ""
    echo "Windows (Chocolatey): choco install k6"
    echo "macOS (Homebrew): brew install k6"
    echo "Linux (Ubuntu): sudo apt-get install k6"
    echo ""
    exit 1
fi

echo "✅ K6 is installed ($(k6 version))"
echo ""

# Change to server directory
cd "$(dirname "$0")/server"

# Display menu
echo "Choose a test scenario:"
echo "1. Smoke Test (5 users, 30s) - Quick validation"
echo "2. Load Test (50 users, 2m) - Baseline performance"
echo "3. Stress Test (100 users, 5m) - Find breaking point"
echo "4. Spike Test (Dynamic load) - Sudden traffic spike"
echo "5. Exit"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo "🚀 Running Smoke Test..."
        npm run test:performance:smoke
        ;;
    2)
        echo "🚀 Running Load Test..."
        npm run test:performance:load
        ;;
    3)
        echo "🚀 Running Stress Test..."
        echo "⚠️  This will stress your system. Continue? (y/n)"
        read -r confirm
        if [ "$confirm" = "y" ]; then
            npm run test:performance:stress
        fi
        ;;
    4)
        echo "🚀 Running Spike Test..."
        npm run test:performance:spike
        ;;
    5)
        echo "👋 Exiting..."
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Test completed!"
echo ""
